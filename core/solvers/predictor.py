from __future__ import print_function

####################
# INPUT PARAMETERS #
####################

BaseDateS = '20150601'
BaseDateF = '20150604'
Acc = 12
LimSU = 2
Range = 1
PathOBS = '/home/ani/ecmwf/dissemination.ecmwf.int/vol/ecpoint/ecPoint_DB/OBS/ECMWF/tp'
PathFC = '/home/ani/ecmwf/dissemination.ecmwf.int/vol/ecpoint/ecPoint_DB/FC/ECMWF41r1_HRES16km_Global'
PathOUT = "/home/ani/ecmwf"
FileNameOUT_predictors = "test.ascii"


#######################################
# DESCRIPTION OF THE INPUT PARAMETERS #
#######################################

# BaseDateS: start base date of the forecast (in the format "yyyymmdd")

# BaseDateF: final base date of the forecast (in the format "yyyymmdd")

# Acc: accumulation (in hours) of the parameter to post-process

# LimSU: upper limit (in hours) of the window in the forecast with spin-up problems

# Range: range for the leadtime (in hours)

# PathOBS: path of the database that contains the observations for the parameter to post-process (string)

# PathFC: path of the database that contains the parameter to post-process and the predictors (string)

# PathOUT: output directory (string)

#########################################################################################################

from core.utils import daterange
from core.loaders.GeopointsLoader import GeopointsLoader, Geopoints
from core.loaders.GribLoader import GribLoader
import os
import numpy
from datetime import datetime, timedelta

#Set up the input/output parameters
BaseDateS = datetime.strptime(BaseDateS, '%Y%m%d').date()
BaseDateF = datetime.strptime(BaseDateF, '%Y%m%d').date()
BaseDateSSTR=BaseDateS.strftime('%Y%m%d')
BaseDateFSTR=BaseDateF.strftime('%Y%m%d')


AccSTR = 'Acc%02dh' % Acc

#precision(4)  # [XXX]

FileNameOUT = 'FER{0}h_{1}'.format(AccSTR, FileNameOUT_predictors)
Output_file = open(os.path.join(PathOUT, FileNameOUT), 'w')
Output_file.write('Ppn Forecast Verification for HRES. Base Date for FC from {0} to {1}. {2}h FC period.'.format(BaseDateSSTR, BaseDateFSTR, AccSTR))
Output_file.write('\n\n')
Output_file.write("'Date' and 'Time' relate to the end of the {0}h FC period.".format(AccSTR))
Output_file.write('\n\n')
Output_file.write('\t'.join(['DATE', 'TimeUTC', 'OBS', 'LatOBS', 'LonOBS', 'FER', 'CPR', 'TP', 'WSPD700', 'CAPE', 'SR24h', 'TimeLST']))
Output_file.write('\n\n')


#############################################################################################

#PROCESSING MODEL DATA
print("****************************************************************************************************")
print("POST-PROCESSING SOFTWARE TO PRODUCE FORECASTS AT POINTS - ecPoint")
print("The user is running the ecPoint-RAINFALL family, Operational Version 1")
print("Forecast Error Ratio (FER) and Predictors for ", Acc, " hour accumulation")
print("List of predictors:")
print("- Convective precipitation ratio, cpr = convective precipitation / total precipitation [-]")
print("- Total precipitation, tp [mm/{}h]".format(Acc))
print("- Wind speed of steering winds (at 700 mbar), wspd700 [m/s]")
print("- Convective available potential energy, cape [J/kg]")
print("- Daily accumulation of clear-sky solar radiation, sr24h [W/m2]")
print("- Local Solar Time, lst [hours]")
print("****************************************************************************************************")

#Counter for the BaseDate and BaseTime to avoid repeating the same forecasts in different cases
counterValidTimes = [0]
obsTOT = 0
obsUSED = 0

#Loop over start dates
for thedate in daterange(BaseDateS, BaseDateF):
    thedateSTR = thedate.strftime("%Y%m%d")

    #Loop over start times
    for thetime in range(0, 12+1, 12):
        if thetime == 0:
            thetimeSTR = "00"
        else:
            thetimeSTR = "12"

        #Loop over start leadtimes
        for LeadStart in range(0, 23, Range): #expressed in hours
            print("FORECAST PARAMETERS")
            print("BaseDate = ", thedateSTR, " BaseTime = ", thetimeSTR, " UTC (t+", LeadStart, ",t+", (LeadStart+Acc), ")")

            #Defining the parameters for the forecasts
            #Case n.1
            if LeadStart <= LimSU:
                print("To avoid any spin-up effect at the begining of the forecast, it will be considered...")

                if thetime == 0:
                    thedateNEW = thedate - timedelta(days=1)
                    thedateNEWSTR = thedateNEW.strftime("%Y%m%d")
                    thetimeNEW = 12
                    thetimeNEWSTR = "12"
                else:
                    thedateNEW = thedate
                    thedateNEWSTR = thedateNEW.strftime("%Y%m%d")
                    thetimeNEW = 0
                    thetimeNEWSTR = "00"

                LeadStartNEW = LeadStart + 12

            #Case n.2
            elif (LeadStart > LimSU) and (LeadStart <= 12+LimSU):
                print("The forecast parameters do not change...")
                thedateNEW = thedate
                thedateNEWSTR=thedateNEW.strftime("%Y%m%d")
                thetimeNEW = thetime
                if thetime == 0:
                    thetimeNEWSTR = "00"
                else:
                    thetimeNEWSTR = "12"

                LeadStartNEW = LeadStart

            #Case n.3
            elif LeadStart > (12 + LimSU):
                print("A shorter range forecast is considered...")
                if thetime == 0:
                    thedateNEW = thedate
                    thedateNEWSTR=thedateNEW.strftime("%Y%m%d")
                    thetimeNEW = 12
                    thetimeNEWSTR = "12"
                else:
                    thedateNEW = thedate + timedelta(days=1)
                    thedateNEWSTR=thedateNEW.strftime("%Y%m%d")
                    thetimeNEW = 0
                    thetimeNEWSTR = "00"

                LeadStartNEW = LeadStart - 12

            print("BaseDate = ", thedateNEWSTR, " BaseTime = ", thetimeNEWSTR, " UTC (t+", LeadStartNEW, ",t+", LeadStartNEW+Acc, ")")

            #Reading the forecasts
            if thedateNEW < BaseDateS or thedateNEW > BaseDateF:
                print("IMPORTANT NOTE!!")
                print("The requested BaseDate is not within the range defined by BaseDateS=", BaseDateSSTR, " and BaseDateF=", BaseDateFSTR)
                print("Case not considered. Go to the following forecast.")
            else:
                #Note about the computation of the sr.
                #The solar radiation is a cumulative variable and its units is J/m2 (which means, W*s/m2).
                #One wants the 24h. The 24h mean is obtained by taking the difference between the beginning and the end of the 24 hourly period
                #and dividing by the number of seconds in that period (24h = 86400 sec). Thus, the unit will be W/m2

                #6 hourly Accumulation
                if Acc == 6:
                    #Steps
                    step1 = LeadStartNEW
                    step2 = LeadStartNEW + Acc

                    step1STR = "{:02d}".format(step1)
                    step2STR = "{:02d}".format(step2)

                    # Defining the parameters for the rainfall observations
                    validDateF = thedateNEW + (thetimeNEW/24) + (step2/24)
                    DateVF = validDateF.strftime("%Y%m%d")  # [XXX] - DateVF is NOT a date
                    HourVF = validDateF.strftime("%H") # [XXX]
                    HourVF_num = validDateF.hour
                    print("RAINFALL OBS PARAMETERS")
                    print("Validity date/time (end of the ", AccSTR, " hourly period) = ", validDateF)

                    #Looking for no repetions in the computed dates and times
                    if validDateF in counterValidTimes:
                        print("Valid Date and Time already computed.")
                        print("Case not considered. Go to the following forecast.")
                    else:
                        counterValidTimes.append(validDateF)
                        dirOBS = os.path.join(PathOBS, AccSTR, DateVF)
                        fileOBS = 'tp_{:02d}_{}_{}.geo'.format(Acc, DateVF, HourVF)

                        if not os.path.exists(os.path.join(dirOBS, fileOBS)):
                            print("IMPORTANT NOTE!!")
                            print("The file ", fileOBS, " do not exist on the database ", PathOBS)
                            print("Case not considered. Go to the following forecast.")
                        else:
                            #Reading Rainfall Observations
                            print("READING RAINFALL OBS")
                            print("Reading... ", os.path.join(dirOBS, fileOBS))
                            obs=GeopointsLoader(path=os.path.join(dirOBS, fileOBS))
                            nOBS = len(obs.values)

                            if nOBS == 1:
                            # which will account for the cases of zero observation in the geopoint file (because the length of the vector will be forced to 1),
                            # or cases in which there is only one observation in the geopoint file
                                print("IMPORTANT NOTE!!")
                                print("No rainfall observations in ", fileOBS)
                                print("Case not considered. Go to the following forecast.")
                            else:
                                obsTOT = obsTOT + nOBS
                                if step2 <= 24:
                                    step1sr = 0
                                    step2sr = 24
                                else:
                                    step1sr = step2 - 24
                                    step2sr = step2

                                step1srSTR = "%02d" % step1sr
                                step2srSTR = "%02d" % step2sr

                                #Reading forecasts
                                print("READING FORECASTS")

                                tp1 = GribLoader(path=os.path.join(PathFC, 'tp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['tp', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                tp2 = GribLoader(path=os.path.join(PathFC, 'tp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['tp', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))

                                cp1 = GribLoader(path=os.path.join(PathFC, 'cp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cp', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                cp2 = GribLoader(path=os.path.join(PathFC, 'cp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cp', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))

                                u1 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                u2 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))

                                v1 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                v2 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))

                                cape1 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                cape2 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))

                                sr1 = GribLoader(path=os.path.join(PathFC, 'sr', thedateNEWSTR + thetimeNEWSTR, '_'.join(['sr', thedateNEWSTR, thetimeNEWSTR, step1srSTR]) + '.grib'))
                                sr2 = GribLoader(path=os.path.join(PathFC, 'sr', thedateNEWSTR + thetimeNEWSTR, '_'.join(['sr', thedateNEWSTR, thetimeNEWSTR, step2srSTR]) + '.grib'))

                                #Compute the 6 hourly fields
                                print('\nCOMPUTING')
                                print('Computing the required parameters (FER, cpr, tp, wspd700, cape, sr)...')
                                TP = (tp2 - tp1) * 1000
                                CP = (cp2 - cp1) * 1000
                                U700 = (u1 + u2) / 2
                                V700 = (v1 + v2) / 2
                                WSPD = ((U700 ** 2) + (V700 ** 2)) ** 0.5
                                CAPE = (cape1 + cape2) / 2
                                SR = (sr2 - sr1) / 86400

                                #Select the nearest grid-point from the rainfall observations
                                print('Selecting the nearest grid point to rainfall obs...')
                                TP_Ob = TP.nearest_gridpoint(obs)  # Geopoints(list) instance
                                CP_Ob = CP.nearest_gridpoint(obs)
                                WSPD_Ob = WSPD.nearest_gridpoint(obs)
                                CAPE_Ob = CAPE.nearest_gridpoint(obs)
                                SR_Ob = SR.nearest_gridpoint(obs)

                                #Select only the values that correspond to TP>=1
                                print('Selecting the values that correspond to tp >= 1 mm/{}h...'.format(Acc))
                                TP_Ob1 = Geopoints(
                                    TP_geopoint
                                    for TP_geopoint in TP_Ob
                                    if TP_geopoint.value >= 1
                                )
                                if not TP_Ob1:
                                    print("IMPORTANT NOTE!!")
                                    print('No values of tp >= 1 mm/{}h.'.format(Acc))
                                    print("Case not considered. Go to the following forecast.")
                                else:
                                    print('\nSAVING')
                                    print("Saving the data in ", os.path.join(PathOUT, FileNameOUT, '...'))

                                    CP_Ob1 = Geopoints(
                                        CP_geopoint
                                        for CP_geopoint, TP_geopoint in zip(CP_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    WSPD_Ob1 = Geopoints(
                                        WSPD_geopoint
                                        for WSPD_geopoint, TP_geopoint in zip(WSPD_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    CAPE_Ob1 = Geopoints(
                                        CAPE_geopoint
                                        for CAPE_geopoint, TP_geopoint in zip(CAPE_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    SR_Ob1 = Geopoints(
                                        SR_geopoint
                                        for SR_geopoint, TP_geopoint in zip(SR_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    # Compute other parameters
                                    obs1 = Geopoints(
                                        obs_geopoint
                                        for obs_geopoint, TP_geopoint in zip(obs.geopoints, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    latObs_1 = obs1.latitudes
                                    lonObs_1 = obs1.longitudes
                                    CPr = CP_Ob1 / TP_Ob1
                                    FER = (obs1 - TP_Ob1) / TP_Ob1

                                    # Compute the Local Solar Time
                                    # Select values at the right of the Greenwich Meridian
                                    temp_lonPos = lonObs_1 * (lonObs_1 >= 0)
                                    # Compute the time difference between the local place and the Greenwich Meridian
                                    lstPos = HourVF_num + (temp_lonPos/15.0)
                                    # Put back to zero the values that are not part of the subset (lonObs_1 >= 0)
                                    lstPos = lstPos * (temp_lonPos != 0)
                                    # Adjust the times that appear bigger than 24 (the time relates to the following day)
                                    temp_lstPosMore24 = (lstPos * (lstPos >= 24)) - 24
                                    temp_lstPosMore24 = temp_lstPosMore24 * (temp_lstPosMore24 > 0)
                                    # Restore the dataset
                                    tempPos = lstPos * (lstPos < 24) + temp_lstPosMore24
                                    # Select values at the left of the Greenwich Meridian
                                    temp_lonNeg = lonObs_1 * (lonObs_1 < 0)
                                    # Compute the time difference between the local place and the Greenwich Meridian
                                    lstNeg = HourVF_num - abs((temp_lonNeg/15.0))
                                    # Put back to zero the values that are not part of the subset (lonObs_1 < 0)
                                    lstNeg = lstNeg * (temp_lonNeg != 0)
                                    # Adjust the times that appear smaller than 24 (the time relates to the previous day)
                                    temp_lstNegLess0 = lstNeg * (lstNeg < 0) + 24
                                    temp_lstNegLess0 = temp_lstNegLess0 * (temp_lstNegLess0 != 24)
                                    # Restore the dataset
                                    tempNeg = lstNeg * (lstNeg >0) + temp_lstNegLess0
                                    # Combine both subsets
                                    vals_LST = numpy.concatenate(tempPos, tempNeg)

                                    #Saving the outpudt file in ascii format
                                    vals_TP = TP_Ob1.values
                                    vals_CP = CP_Ob1.values
                                    vals_OB = obs1.values
                                    vals_FER = FER.values
                                    vals_CPr = CPr.values
                                    vals_WSPD = WSPD_Ob1.values
                                    vals_CAPE = CAPE_Ob1.values
                                    vals_SR = SR_Ob1.values

                                    n = len(vals_FER)
                                    obsUSED = obsUSED + n
                                    for i in range(n):
                                        data = map(str, [DateVF, HourVF, vals_OB[i], latObs_1[i], lonObs_1[i], vals_FER[i], vals_CPr[i], vals_TP[i], vals_WSPD[i], vals_CAPE[i], vals_SR[i], vals_LST[i]])
                                        Output_file.write('\t'.join(data) + '\n')

                #12 hourly Accumulation
                elif Acc == 12:
                    #Steps
                    step1 = LeadStartNEW
                    step2 = LeadStartNEW + (Acc/2)
                    step3 = LeadStartNEW + Acc

                    step1STR = "{:02d}".format(step1)
                    step2STR = "{:02d}".format(step2)
                    step3STR = "{:02d}".format(step3)

                    #Defining the parameters for the rainfall observations
                    validDateF = thedateNEW + timedelta(hours=thetimeNEW) + timedelta(hours=step3)
                    DateVF = validDateF.strftime("%Y%m%d")
                    HourVF = validDateF.strftime("%H")  # [XXX]
                    print("RAINFALL OBS PARAMETERS")
                    print("Validity date/time (end of the ", AccSTR, " hourly period) = ", validDateF)

                    #Looking for no repetions in the computed dates and times
                    if validDateF in counterValidTimes:
                        print("Valid Date and Time already computed.")
                        print("Case not considered. Go to the following forecast.")
                    else:
                        counterValidTimes.append(validDateF)
                        dirOBS = os.path.join(PathOBS, AccSTR, DateVF)
                        fileOBS = 'tp_{:02d}_{}_{}.geo'.format(Acc, DateVF, HourVF)

                        if not os.path.exists(os.path.join(dirOBS, fileOBS)):
                            print("IMPORTANT NOTE!!")
                            print("The file ", fileOBS, " do not exist on the database ", PathOBS)
                            print("Case not considered. Go to the following forecast.")
                        else:
                            #Reading Rainfall Observations
                            print("READING RAINFALL OBS")
                            print("Reading... ", os.path.join(dirOBS, fileOBS))
                            obs=GeopointsLoader(path=os.path.join(dirOBS, fileOBS))
                            nOBS = len(obs.values)

                            if nOBS == 1:
                                #which will account for the cases of zero obeservation in the geopoint file (because the length of the vector will be forced to 1),
                                #or cases in which there is only one observation in the geopoint file
                                print('IMPORTANT NOTE!')
                                print('No rainfall observations in ', fileOBS)
                                print('Case not considered. Go to the following forecast.')
                            else:
                                obsTOT = obsTOT + nOBS
                                if step3 <= 24:
                                    step1sr = 0
                                    step3sr = 24
                                else:
                                    step1sr = step3 - 24
                                    step3sr = step3

                                step1srSTR = '%02d' % step1sr
                                step3srSTR = '%02d' % step3sr

                                #Reading forecasts
                                print("READING FORECASTS")
                                tp1 = GribLoader(path=os.path.join(PathFC, 'tp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['tp', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                tp3 = GribLoader(path=os.path.join(PathFC, 'tp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['tp', thedateNEWSTR, thetimeNEWSTR, step3STR]) + '.grib'))

                                cp1 = GribLoader(path=os.path.join(PathFC, 'cp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cp', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                cp3 = GribLoader(path=os.path.join(PathFC, 'cp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cp', thedateNEWSTR, thetimeNEWSTR, step3STR]) + '.grib'))

                                u1 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                u2 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))
                                u3 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step3STR]) + '.grib'))

                                v1 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                v2 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))
                                v3 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step3STR]) + '.grib'))

                                cape1 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                cape2 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))
                                cape3 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step3STR]) + '.grib'))

                                sr1 = GribLoader(path=os.path.join(PathFC, 'sr', thedateNEWSTR + thetimeNEWSTR, '_'.join(['sr', thedateNEWSTR, thetimeNEWSTR, step1srSTR]) + '.grib'))
                                sr3 = GribLoader(path=os.path.join(PathFC, 'sr', thedateNEWSTR + thetimeNEWSTR, '_'.join(['sr', thedateNEWSTR, thetimeNEWSTR, step3srSTR]) + '.grib'))

                                #Compute the 12 hourly fields
                                print("COMPUTING")
                                print("Computing the required parameters (FER, cpr, tp, wspd700, cape, sr)...")
                                TP = (tp3 - tp1) * 1000
                                CP = (cp3 - cp1) * 1000
                                U700 = ((u1 * 0.5) + u2 + (u3 * 0.5)) * 0.5
                                V700 = ((v1 * 0.5) + v2 + (v3 * 0.5)) * 0.5
                                WSPD = ((U700 ** 2) + (V700 ** 2)) ** 0.5
                                CAPE = ((cape1 * 0.5) + cape2 + (cape3*0.5)) * 0.5
                                SR = (sr3 - sr1) / 86400

                                #Select the nearest grid-point from the rainfall observations
                                print("Selecting the nearest grid point to rainfall obs...")
                                TP_Ob = TP.nearest_gridpoint(obs)
                                CP_Ob = CP.nearest_gridpoint(obs)
                                WSPD_Ob = WSPD.nearest_gridpoint(obs)
                                CAPE_Ob = CAPE.nearest_gridpoint(obs)
                                SR_Ob = SR.nearest_gridpoint(obs)

                                #Select only the values that correspond to TP>=1
                                print('Selecting the values that correspond to tp >= 1 mm/{}h...'.format(Acc))
                                TP_Ob1 = Geopoints(
                                    TP_geopoint
                                    for TP_geopoint in TP_Ob
                                    if TP_geopoint.value >= 1
                                )
                                if not TP_Ob1:
                                    print('\nIMPORTANT NOTE!')
                                    print('No values of tp >= 1 mm/{}h.'.format(Acc))
                                    print('Case not considered. Go to the following forecast.')
                                else:
                                    print('\nSAVING')
                                    print('Saving the data in ', os.path.join(PathOUT, FileNameOUT), '...')
                                    CP_Ob1 = Geopoints(
                                        CP_geopoint
                                        for CP_geopoint, TP_geopoint in zip(CP_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    WSPD_Ob1 = Geopoints(
                                        WSPD_geopoint
                                        for WSPD_geopoint, TP_geopoint in zip(WSPD_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    CAPE_Ob1 = Geopoints(
                                        CAPE_geopoint
                                        for CAPE_geopoint, TP_geopoint in zip(CAPE_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    SR_Ob1 = Geopoints(
                                        SR_geopoint
                                        for SR_geopoint, TP_geopoint in zip(SR_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    # Compute other parameters
                                    obs1 = Geopoints(
                                        obs_geopoint
                                        for obs_geopoint, TP_geopoint in zip(obs.geopoints, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )
                                    latObs_1 = obs1.latitudes
                                    lonObs_1 = obs1.longitudes
                                    CPr = CP_Ob1 / TP_Ob1
                                    FER = (obs1 - TP_Ob1) / TP_Ob1

                                    #Saving the output file in ascii format
                                    vals_TP = TP_Ob1.values
                                    vals_CP = CP_Ob1.values
                                    vals_OB = obs1.values
                                    vals_FER = FER.values
                                    vals_CPr = CPr.values
                                    vals_WSPD = WSPD_Ob1.values
                                    vals_CAPE = CAPE_Ob1.values
                                    vals_SR = SR_Ob1.values

                                    n = len(vals_FER)
                                    obsUSED = obsUSED + n
                                    for i in range(n):
                                        data = map(str, [DateVF, HourVF, vals_OB[i], latObs_1[i], lonObs_1[i], vals_FER[i], vals_CPr[i], vals_TP[i], vals_WSPD[i], vals_CAPE[i], vals_SR[i], 'NaN'])
                                        Output_file.write('\t'.join(data) + '\n')

                #24 hourly Accumulation
                elif Acc == 24:
                    #Steps
                    step1 = LeadStartNEW
                    step2 = LeadStartNEW + (Acc/4)
                    step3 = LeadStartNEW + (Acc/2)
                    step4 = LeadStartNEW + (3*Acc/4)
                    step5 = LeadStartNEW + Acc

                    step1STR = "{:02d}".format(step1)
                    step2STR = "{:02d}".format(step2)
                    step3STR = "{:02d}".format(step3)
                    step4STR = "{:02d}".format(step4)
                    step5STR = "{:02d}".format(step5)

                    #Defining the parameters for the rainfall observations
                    validDateF = thedateNEW + (thetimeNEW/24) + (step5/24)
                    DateVF = validDateF.strftime("%Y%m%d")
                    HourVF = validDateF.strftime("%H")  # [XXX]
                    print("RAINFALL OBS PARAMETERS")
                    print("Validity date/time (end of the ", AccSTR, " hourly period) = ", validDateF)

                    #Looking for no repetions in the computed dates and times
                    if validDateF in counterValidTimes:
                        print("Valid Date and Time already computed.")
                        print("Case not considered. Go to the following forecast.")
                    else:
                        counterValidTimes.append(validDateF)
                        dirOBS = os.path.join(PathOBS, AccSTR, DateVF)
                        fileOBS = 'tp_{:02d}_{}_{}.geo'.format(Acc, DateVF, HourVF)

                        if not os.path.exists(os.path.join(dirOBS, fileOBS)):
                            print("IMPORTANT NOTE!!")
                            print("The file ", fileOBS, " do not exist on the database ", PathOBS)
                            print("Case not considered. Go to the following forecast.")
                        else:
                            #Reading Rainfall Observations
                            print("READING RAINFALL OBS")
                            print("Reading... ", os.path.join(dirOBS, fileOBS))
                            obs=GeopointsLoader(path=os.path.join(dirOBS, fileOBS))
                            nOBS = len(obs.values)

                            if nOBS == 1:
                                # which will account for the cases of zero obeservation in the geopoint file (because the length of the vector will be forced to 1),
                                # or cases in which there is only one observation in the geopoint file
                                print("IMPORTANT NOTE!!")
                                print("No rainfall observations in ", fileOBS)
                                print("Case not considered. Go to the following forecast.")
                            else:
                                #Reading Forecasts
                                obsTOT = obsTOT + nOBS
                                print("READING FORECASTS")
                                tp1 = GribLoader(path=os.path.join(PathFC, 'tp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['tp', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                tp5 = GribLoader(path=os.path.join(PathFC, 'tp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['tp', thedateNEWSTR, thetimeNEWSTR, step5STR]) + '.grib'))

                                cp1 = GribLoader(path=os.path.join(PathFC, 'cp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cp', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                cp5 = GribLoader(path=os.path.join(PathFC, 'cp', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cp', thedateNEWSTR, thetimeNEWSTR, step5STR]) + '.grib'))

                                u1 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                u2 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))
                                u3 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step3STR]) + '.grib'))
                                u4 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step4STR]) + '.grib'))
                                u5 = GribLoader(path=os.path.join(PathFC, 'u700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['u700', thedateNEWSTR, thetimeNEWSTR, step5STR]) + '.grib'))

                                v1 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                v2 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))
                                v3 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step3STR]) + '.grib'))
                                v4 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step4STR]) + '.grib'))
                                v5 = GribLoader(path=os.path.join(PathFC, 'v700', thedateNEWSTR + thetimeNEWSTR, '_'.join(['v700', thedateNEWSTR, thetimeNEWSTR, step5STR]) + '.grib'))

                                cape1 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                cape2 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step2STR]) + '.grib'))
                                cape3 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step3STR]) + '.grib'))
                                cape4 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step4STR]) + '.grib'))
                                cape5 = GribLoader(path=os.path.join(PathFC, 'cape', thedateNEWSTR + thetimeNEWSTR, '_'.join(['cape', thedateNEWSTR, thetimeNEWSTR, step5STR]) + '.grib'))

                                sr1 = GribLoader(path=os.path.join(PathFC, 'sr', thedateNEWSTR + thetimeNEWSTR, '_'.join(['sr', thedateNEWSTR, thetimeNEWSTR, step1STR]) + '.grib'))
                                sr5 = GribLoader(path=os.path.join(PathFC, 'sr', thedateNEWSTR + thetimeNEWSTR, '_'.join(['sr', thedateNEWSTR, thetimeNEWSTR, step5STR]) + '.grib'))

                                #Compute the 24 hourly fields
                                print('\nCOMPUTING')
                                print('Computing the required parameters (FER, cpr, tp, wspd700, cape, sr)...')
                                TP = (tp5 - tp1) * 1000
                                CP = (cp5 - cp1) * 1000
                                U700 = ((u1*0.5) + u2 + u3 + u4 + (u5*0.5)) / 4
                                V700 = ((v1*0.5) + v2 + v3 + v4 + (v5*0.5)) / 4
                                WSPD = ((U700**2)+(V700**2)) ** 0.5
                                CAPE = ((cape1*0.5) + cape2 + cape3 + cape4 + (cape5*0.5)) / 4
                                SR = (sr5 - sr1) / 86400

                                #Select the nearest grid-point from the rainfall observations
                                print('Selecting the nearest grid point to rainfall obs...')
                                TP_Ob = TP.nearest_gridpoint(obs)
                                CP_Ob = CP.nearest_gridpoint(obs)
                                WSPD_Ob = WSPD.nearest_gridpoint(obs)
                                CAPE_Ob = CAPE.nearest_gridpoint(obs)
                                SR_Ob = SR.nearest_gridpoint(obs)

                                #Select only the values that correspond to TP>=1
                                print('Selecting the values that correspond to tp >= 1 mm/{}h...'.format(Acc))
                                TP_Ob1 = Geopoints(
                                    TP_geopoint
                                    for TP_geopoint in TP_Ob
                                    if TP_geopoint.value >= 1
                                )
                                if not TP_Ob1:
                                    print('\nIMPORTANT NOTE!')
                                    print('No values of tp >= 1 mm/{}h.'.format(Acc))
                                    print("Case not considered. Go to the following forecast.")
                                else:
                                    print("SAVING")
                                    print("Saving the data in ", os.path.join(PathOUT, FileNameOUT), '...')
                                    CP_Ob1 = Geopoints(
                                        CP_geopoint
                                        for CP_geopoint, TP_geopoint in zip(CP_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    WSPD_Ob1 = Geopoints(
                                        WSPD_geopoint
                                        for WSPD_geopoint, TP_geopoint in zip(WSPD_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    CAPE_Ob1 = Geopoints(
                                        CAPE_geopoint
                                        for CAPE_geopoint, TP_geopoint in zip(CAPE_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    SR_Ob1 = Geopoints(
                                        SR_geopoint
                                        for SR_geopoint, TP_geopoint in zip(SR_Ob, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )

                                    # Compute other parameters
                                    obs1 = Geopoints(
                                        obs_geopoint
                                        for obs_geopoint, TP_geopoint in zip(obs.geopoints, TP_Ob)
                                        if TP_geopoint.value >= 1
                                    )
                                    latObs_1 = obs1.latitudes
                                    lonObs_1 = obs1.longitudes
                                    CPr = CP_Ob1 / TP_Ob1
                                    FER = (obs1 - TP_Ob1) / TP_Ob1

                                    #Saving the output file in ascii format
                                    vals_TP = TP_Ob1.values
                                    vals_CP = CP_Ob1.values
                                    vals_OB = obs1.values
                                    vals_FER = FER.values
                                    vals_CPr = CPr.values
                                    vals_WSPD = WSPD_Ob1.values
                                    vals_CAPE = CAPE_Ob1.values
                                    vals_SR = SR_Ob1.values

                                    n = len(vals_FER)
                                    obsUSED = obsUSED + n
                                    for i in range(n):
                                        data = map(str, [DateVF, HourVF, vals_OB[i], latObs_1[i], lonObs_1[i], vals_FER[i], vals_CPr[i], vals_TP[i], vals_WSPD[i], vals_CAPE[i], vals_SR[i], 'NaN'])
                                        Output_file.write('\t'.join(data) + '\n')

            print('\n' + '*'*80)

print('Number of observations in the whole training period:', obsTOT)
print('Number of observations actually used in the training period (that correspond to tp >= 1 mm/{0}h: {1}'.format(Acc, obsUSED))

Output_file.write('\nNumber of observations in the whole training period: {}\n'.format(obsTOT))
Output_file.write('Number of observations actually used in the training period (that correspond to tp >= 1 mm/{0}h): {1}'.format(Acc, obsUSED))