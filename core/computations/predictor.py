from __future__ import print_function

import numpy
import os
from datetime import datetime, timedelta

from core.loaders.GeopointsLoader import GeopointsLoader, Geopoints
from core.loaders.GribLoader import GribLoader
from .utils import (
    iter_daterange,
    adjust_leadstart,
    generate_steps,
    compute_accumulated_field,
    compute_weighted_average_field,
    compute_rms_field,
    compute_local_solar_time,
    log,
)

from .computer import Computer


def run(parameters):
    BaseDateS = parameters.date_start
    BaseDateF = parameters.date_end
    Acc = parameters.accumulation
    LimSU = parameters.limit_spin_up
    Range = parameters.leadstart_range
    PathOBS = parameters.observation_path
    PathFC = parameters.forecast_path
    PathOUT = parameters.out_path

    # Set up the input/output parameters
    BaseDateS = datetime.strptime(BaseDateS, '%Y%m%d').date()
    BaseDateF = datetime.strptime(BaseDateF, '%Y%m%d').date()
    BaseDateSSTR=BaseDateS.strftime('%Y%m%d')
    BaseDateFSTR=BaseDateF.strftime('%Y%m%d')
    AccSTR = 'Acc%02dh' % Acc

    Output_file = open(PathOUT, 'w')
    Output_file.write('Ppn Forecast Verification for HRES. Base Date for FC from {0} to {1}. {2}h FC period.'.format(BaseDateSSTR, BaseDateFSTR, AccSTR))
    Output_file.write('\n\n')
    Output_file.write("'Date' and 'Time' relate to the end of the {0}h FC period.".format(AccSTR))
    Output_file.write('\n\n')
    Output_file.write('\t'.join(['DATE', 'TimeUTC', 'OBS', 'LatOBS', 'LonOBS', 'FER', 'CPR', 'TP', 'WSPD700', 'CAPE', 'SR24h', 'TimeLST']))
    Output_file.write('\n\n')


    #############################################################################################

    #PROCESSING MODEL DATA
    yield log.info("****************************************************************************************************")
    yield log.info("POST-PROCESSING SOFTWARE TO PRODUCE FORECASTS AT POINTS - ecPoint")
    yield log.info("The user is running the ecPoint-RAINFALL family, Operational Version 1")
    yield log.info("Forecast Error Ratio (FER) and Predictors for {}  hour accumulation.".format(Acc))
    yield log.info("List of predictors:")
    yield log.info("- Convective precipitation ratio, cpr = convective precipitation / total precipitation [-]")
    yield log.info("- Total precipitation, tp [mm/{}h]".format(Acc))
    yield log.info("- Wind speed of steering winds (at 700 mbar), wspd700 [m/s]")
    yield log.info("- Convective available potential energy, cape [J/kg]")
    yield log.info("- Daily accumulation of clear-sky solar radiation, sr24h [W/m2]")
    yield log.info("- Local Solar Time, lst [hours]")
    yield log.info("****************************************************************************************************")

    #Counter for the BaseDate and BaseTime to avoid repeating the same forecasts in different cases
    counterValidTimes = set()
    obsTOT = 0
    obsUSED = 0

    for curr_date, curr_time, leadstart in iter_daterange(BaseDateS, BaseDateF):
        yield log.info('FORECAST PARAMETERS')
        yield log.info('BaseDate={} BaseTime={:02d} UTC (t+{}, t+{})'.format(
            curr_date.strftime('%Y%m%d'), curr_time, leadstart, leadstart + Acc))

        curr_date, curr_time, leadstart = adjust_leadstart(
            date=curr_date, hour=curr_time, leadstart=leadstart, limSU=LimSU,
            model_runs_per_day=2
        )
        thedateNEWSTR = curr_date.strftime('%Y%m%d')
        thetimeNEWSTR = '{:02d}'.format(curr_time)

        yield log.info(
            'BaseDate={} BaseTime={} UTC (t+{}, t+{})'.format(
                thedateNEWSTR, thetimeNEWSTR, leadstart, leadstart + Acc)
        )

        #Reading the forecasts
        if curr_date < BaseDateS or curr_date > BaseDateF:
            log.warn(
                'Requested date {} outside input date range: {} - {}'.format(
                    curr_date, BaseDateSSTR, BaseDateFSTR
                )
            )
            continue

        def get_grib_path(predictant, step):
            return os.path.join(
                PathFC, predictant, thedateNEWSTR + thetimeNEWSTR,
                '_'.join([predictant, thedateNEWSTR, thetimeNEWSTR,
                          '{:02d}'.format(step)]) + '.grib'
            )

        #Note about the computation of the sr.
        #The solar radiation is a cumulative variable and its units is J/m2 (which means, W*s/m2).
        #One wants the 24h. The 24h mean is obtained by taking the difference between the beginning and the end of the 24 hourly period
        #and dividing by the number of seconds in that period (24h = 86400 sec). Thus, the unit will be W/m2

        steps = [leadstart + step for step in generate_steps(Acc)]

        # Defining the parameters for the rainfall observations
        validDateF = (
                datetime.combine(curr_date, datetime.min.time()) +
                timedelta(hours=curr_time) +
                timedelta(hours=steps[-1])
        )
        DateVF = validDateF.strftime('%Y%m%d')
        HourVF = validDateF.strftime('%H')
        HourVF_num = validDateF.hour
        yield log.info('RAINFALL OBS PARAMETERS')
        yield log.info(
            'Validity date/time (end of {} hourly '
            'period) = {}'.format(Acc, validDateF)
        )

        #Looking for no repetions in the computed dates and times
        if validDateF in counterValidTimes:
            yield log.warn('Valid Date and Time already computed.')
            continue

        counterValidTimes.add(validDateF)
        dirOBS = os.path.join(PathOBS, AccSTR, DateVF)
        fileOBS = 'tp_{:02d}_{}_{}.geo'.format(Acc, DateVF, HourVF)

        obs_path = os.path.join(dirOBS, fileOBS)
        if not os.path.exists(obs_path):
            yield log.warn('File not found in DB: {}.'.format(obs_path))
            continue

        # Reading Rainfall Observations
        yield log.info('Read rainfall observation: '.format(obs_path))
        obs=GeopointsLoader(path=obs_path)
        nOBS = len(obs.values)

        if nOBS <= 1:
        # which will account for the cases of zero observation in the geopoint file (because the length of the vector will be forced to 1),
        # or cases in which there is only one observation in the geopoint file
            yield log.warn('No rainfall observations: {}.'.format(fileOBS))
            continue

        obsTOT += nOBS
        if steps[-1] <= 24:
            step_start_sr, step_end_sr = 1, 25
        else:
            step_start_sr, step_end_sr = steps[-1] - 24, steps[-1]

        yield log.info('Read forecast data')

        # [TODO] - Should be dynamic
        yield log.info(
            'Computing the required parameters '
            '(FER, cpr, tp, wspd700, cape, sr).'
        )

        computations = parameters.computation_fields
        base_fields = set(parameters.predictor_codes)

        derived_computations = [
            computation for computation in computations
            if set(computation['inputs']) - base_fields != set()
        ]

        base_computations = sorted([
            computation for computation in computations
            if computation not in derived_computations
        ], key=lambda computation: computation['isReference'], reverse=True)

        computations_cache = {}
        computations_result = []
        skip = False

        for computation in base_computations:
            computer = Computer(computation)
            predictor_code = computer.computation['inputs'][0]

            steps = (
                [step_start_sr, step_end_sr]
                if computation['field'] == 'ACCUMULATED_SOLAR_RADIATION'
                else steps
            )

            computation_steps = [
                GribLoader(path=get_grib_path(predictor_code, step))
                for step in steps
            ]

            computed_value = computer.compute(computation_steps)

            computations_cache[
                computation['name']
            ] = computed_value

            yield log.info(
                'Selecting the nearest grid point to rainfall observations.'
            )
            geopoints = computed_value.nearest_gridpoint(obs)

            yield log.info(
                'Selecting values that correspond to '
                'tp >= 1 mm/{}h.'.format(Acc)
            )

            # Select only the values that correspond to TP>=1
            if computation['isReference']:
                ref_geopoints = geopoints
                ref_geopoints_filtered = Geopoints(
                    geopoint
                    for geopoint in ref_geopoints
                    if geopoint.value >= 1
                )

                if not ref_geopoints_filtered:
                    yield log.warn(
                        'No values of {} >= 1 mm/{}h.'.format(computation['name'], Acc)
                    )
                    skip = True
                    break
                else:
                    computations_result.append(ref_geopoints_filtered.values)
            else:
                geopoints_filtered = Geopoints(
                    geopoint
                    for geopoint, ref_geopoint in zip(geopoints, ref_geopoints)
                    if ref_geopoint.value >= 1
                )
                computations_result.append(geopoints_filtered.values)

        if skip:
            continue

        for computation in derived_computations:
            computer = Computer(computation)
            steps = [
                computations_cache[field_input]
                for field_input in computation['inputs']
            ]

            computed_value = computer.compute(steps)
            geopoints = computed_value.nearest_gridpoint(obs)

            geopoints_filtered = Geopoints(
                geopoint
                for geopoint, ref_geopoint in zip(geopoints, ref_geopoints)
                if ref_geopoint.value >= 1
            )
            computations_result.append(geopoints_filtered.values)

        # Compute other parameters
        obs1 = Geopoints(
            obs_geopoint
            for obs_geopoint, ref_geopoint in zip(obs.geopoints, ref_geopoints)
            if ref_geopoint.value >= 1
        )

        latObs_1 = obs1.latitudes
        lonObs_1 = obs1.longitudes
        # [XXX] CPr = CP_Ob1 / TP_Ob1
        FER = (obs1 - ref_geopoints_filtered) / ref_geopoints_filtered
        vals_LST = compute_local_solar_time(longitudes=lonObs_1,
                                            hour=HourVF_num)

        #Saving the outpudt file in ascii format
        vals_OB = obs1.values
        vals_FER = FER.values

        data = []

        n = len(vals_FER)
        obsUSED = obsUSED + n
        yield log.success('Write data to: {}'.format(PathOUT))

        for i in range(n):
            data = map(str, [DateVF, HourVF, vals_OB[i], latObs_1[i], lonObs_1[i], vals_FER[i], vals_LST[i]] + [x[i] for x in computations_result])
            Output_file.write('\t'.join(data) + '\n')

        yield log.info('\n' + '*'*80)

    yield log.success(
        'Number of observations in the whole training period: '.format(obsTOT)
    )
    yield log.success(
        'Number of observations actually used in the training period '
        '(tp >= 1 mm/{}h): {}'.format(Acc, obsUSED)
    )

    Output_file.write('\nNumber of observations in the whole training period: {}\n'.format(obsTOT))
    Output_file.write('Number of observations actually used in the training period (that correspond to tp >= 1 mm/{0}h): {1}'.format(Acc, obsUSED))
    Output_file.close()
