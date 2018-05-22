# Metview Macro

#  **************************** LICENSE START ***********************************
#
#  Copyright 2016 ECMWF. This software is distributed under the terms
#  of the Apache License version 2.0. In applying this license, ECMWF does not
#  waive the privileges and immunities granted to it by virtue of its status as
#  an Intergovernmental Organization or submit itself to any jurisdiction.
#
#  ***************************** LICENSE END ************************************
#
#########################################################################################################

####################
# INPUT PARAMETERS #
####################

BaseDateS = '20160101'
BaseDateF = '20160101'
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

from ..utils import daterange
from ..loaders.GeopointsLoader import GeopointsLoader
import os
from math import sqrt
from datetime import datetime, timedelta

#Set up the input/output parameters
BaseDateS = datetime.strptime(BaseDateS, '%Y%m%d').date()
BaseDateF = datetime.strptime(BaseDateF, '%Y%m%d').date()
BaseDateSSTR=BaseDateS.strftime('%Y%m%d')
BaseDateFSTR=BaseDateF.strftime('%Y%m%d')


AccSTR = '%02d'.format(Acc)

precision(4)  # [XXX]

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

                    step1STR = "%02d".format(step1)
                    step2STR = "%02d".format(step2)

                    # Defining the parameters for the rainfall observations
                    validDateF = thedateNEW + (thetimeNEW/24) + (step2/24)  # [XXX]
                    DateVF = validDateF.strftime("%Y%m%d")  # [XXX] - DateVF is NOT a date
                    HourVF = validDateF.strftime("%H") # [XXX]
                    HourVF_num = validDateF.hour
                    print("RAINFALL OBS PARAMETERS")
                    print("Validity date/time (end of the ", AccSTR, " hourly period) = ", validDateF)

                    #Looking for no repetions in the computed dates and times
                    checkNoRepeat = (counterValidTimes = number(validDateF, "yyyymmddHH"))
                    if sum(vector(checkNoRepeat)) > 0:
                        print("Valid Date and Time already computed.")
                        print("Case not considered. Go to the following forecast.")
                    else:
                        counterValidTimes = counterValidTimes & [number(validDateF, "yyyymmddHH")]  # [XXX]
                        dirOBS = os.path.join(PathOBS, AccSTR, DateVF)
                        fileOBS = 'PPT{0}_obs_Global_{1}{2}.geo'.format(AccSTR, DateVF, HourVF)

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

                                step1srSTR = "%02d".format(step1sr)
                                step2srSTR = "%02d".format(step2sr)

                                #Reading forecasts
                                print("READING FORECASTS")
                                tp1 = read(PathFC & "/tp/" & thedateNEWSTR & thetimeNEWSTR & "/tp" & "_" & thedateNEWSTR &  "_" & thetimeNEWSTR & "_" & step1STR)
                                tp2 = read(PathFC & "/tp/" & thedateNEWSTR & thetimeNEWSTR & "/tp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                cp1 = read(PathFC & "/cp/" & thedateNEWSTR & thetimeNEWSTR & "/cp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                cp2 = read(PathFC & "/cp/" & thedateNEWSTR & thetimeNEWSTR & "/cp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                u1 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                u2 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                v1 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                v2 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                cape1 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                cape2 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                sr1 = read(PathFC & "/sr/" & thedateNEWSTR & thetimeNEWSTR & "/sr" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1srSTR)
                                sr2 = read(PathFC & "/sr/" & thedateNEWSTR & thetimeNEWSTR & "/sr" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2srSTR)

                                #Compute the 6 hourly fields
                                print('\nCOMPUTING')
                                print('Computing the required parameters (FER, cpr, tp, wspd700, cape, sr)...')
                                TP = (tp2 - tp1) * 1000
                                CP = (cp2 - cp1) * 1000
                                U700 = (u1 + u2) / 2
                                V700 = (v1 + v2) / 2
                                WSPD = sqrt((U700**2)+(V700**2))
                                CAPE = (cape1 + cape2) / 2
                                SR = (sr2 - sr1) / 86400

                                #Select the nearest grid-point from the rainfall observations
                                print('Selecting the nearest grid point to rainfall obs...')
                                TP_Ob = nearest_gridpoint(TP,obs)
                                CP_Ob = nearest_gridpoint(CP,obs)
                                WSPD_Ob = nearest_gridpoint(WSPD,obs)
                                CAPE_Ob = nearest_gridpoint(CAPE,obs)
                                SR_Ob = nearest_gridpoint(SR,obs)

                                #Select only the values that correspond to TP>=1
                                print('Selecting the values that correspond to tp >= 1 mm/{}h...'.format(Acc))
                                TP_Ob1 = filter(TP_Ob,TP_Ob>=1)
                                if count(values(TP_Ob1)) == 1:
                                    print("IMPORTANT NOTE!!")
                                    print('No values of tp >= 1 mm/{}h.'.format(Acc))
                                    print("Case not considered. Go to the following forecast.")
                                else:
                                    print('\nSAVING')
                                    print("Saving the data in ", os.path.join(PathOUT, FileNameOUT, '...'))
                                    CP_Ob1 = filter(CP_Ob,TP_Ob>=1)  # [XXX]
                                    WSPD_Ob1 = filter(WSPD_Ob,TP_Ob>=1)
                                    CAPE_Ob1 = filter(CAPE_Ob,TP_Ob>=1)
                                    SR_Ob1 = filter(SR_Ob,TP_Ob>=1)

                                    #Compute other parameters
                                    obs1 = filter(obs,TP_Ob>=1)
                                    latObs_1 = latitudes(obs1)
                                    lonObs_1 = longitudes(obs1)
                                    CPr = CP_Ob1 / TP_Ob1
                                    FER = (obs1 - TP_Ob1) / TP_Ob1

                                    #Compute the Local Solar Time
                                    temp_lonPos = lonObs_1 * (lonObs_1 >= 0) #Select values at the right of the Greenwich Meridian
                                    lstPos = HourVF_num + (temp_lonPos/15) #Compute the time difference between the local place and the Greenwich Meridian
                                    lstPos = lstPos * (temp_lonPos <> 0) #Put back to zero the values that are not part of the subset (lonObs_1 >= 0)
                                    temp_lstPosMore24 = (lstPos * (lstPos >= 24)) - 24 #Adjust the times that appear bigger than 24 (the time relates to the following day)
                                    temp_lstPosMore24 = temp_lstPosMore24 * (temp_lstPosMore24>0)
                                    tempPos = lstPos * (lstPos < 24) + temp_lstPosMore24 #Restore the dataset
                                    temp_lonNeg = lonObs_1 * (lonObs_1 < 0) #Select values at the left of the Greenwich Meridian
                                    lstNeg = HourVF_num - abs((temp_lonNeg/15)) #Compute the time difference between the local place and the Greenwich Meridian
                                    lstNeg = lstNeg * (temp_lonNeg <> 0) #Put back to zero the values that are not part of the subset (lonObs_1 < 0)
                                    temp_lstNegLess0 = lstNeg * (lstNeg < 0) + 24 #Adjust the times that appear smaller than 24 (the time relates to the previous day)
                                    temp_lstNegLess0 = temp_lstNegLess0 * (temp_lstNegLess0 <> 24)
                                    tempNeg = lstNeg * (lstNeg >0) + temp_lstNegLess0 #Restore the dataset
                                    vals_LST = tempPos + tempNeg #Combine both subsets

                                    #Saving the output file in ascii format
                                    vals_TP = values(TP_Ob1)
                                    vals_CP = values(CP_Ob1)
                                    vals_OB = values(obs1)
                                    vals_FER = values(FER)
                                    vals_CPr = values(CPr)
                                    vals_WSPD = values(WSPD_Ob1)
                                    vals_CAPE = values(CAPE_Ob1)
                                    vals_SR = values(SR_Ob1)

                                    n = count(vals_FER)
                                    obsUSED = obsUSED + n
                                    for i in range(1, n+1): # [XXX] Make it zero-index based
                                        data = map(str, [DateVF, HourVF, vals_OB[i], latObs_1[i], lonObs_1[i], vals_FER[i], vals_CPr[i], vals_TP[i], vals_WSPD[i], vals_CAPE[i], vals_SR[i], vals_LST[i]])
                                        Output_file.write('\t'.join(data) + '\n')

                #12 hourly Accumulation
                elif Acc == 12:
                    #Steps
                    step1 = LeadStartNEW
                    step2 = LeadStartNEW + (Acc/2)
                    step3 = LeadStartNEW + Acc

                    step1STR = "%02d".format(step1)
                    step2STR = "%02d".format(step2)
                    step3STR = "%02d".format(step3)

                    #Defining the parameters for the rainfall observations
                    validDateF = thedateNEW + (thetimeNEW/24) + (step3/24)
                    DateVF = validDateF.strftime("%Y%m%d")
                    HourVF = validDateF.strftime("%H")  # [XXX]
                    print("RAINFALL OBS PARAMETERS")
                    print("Validity date/time (end of the ", AccSTR, " hourly period) = ", validDateF)

                    #Looking for no repetions in the computed dates and times
                    checkNoRepeat = (counterValidTimes = number(validDateF, "yyyymmddHH"))  # [XXX] Find out that the hell is this.
                    if sum(vector(checkNoRepeat)) > 0:
                        print("Valid Date and Time already computed.")
                        print("Case not considered. Go to the following forecast.")
                    else:
                        counterValidTimes = counterValidTimes & [number(validDateF, "yyyymmddHH")]  # [XXX] This is a list concat operation.
                        dirOBS = os.path.join(PathOBS, AccSTR, DateVF)
                        fileOBS = 'PPT{0}_obs_Global_{1}{2}.geo'.format(AccSTR, DateVF, HourVF)

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

                                step1srSTR = '%02d'.format(step1sr)
                                step3srSTR = '%02d'.format(step3sr)

                                #Reading forecasts
                                print("READING FORECASTS")
                                tp1 = read(PathFC & "/tp/" & thedateNEWSTR & thetimeNEWSTR & "/tp" & "_" & thedateNEWSTR &  "_" & thetimeNEWSTR & "_" & step1STR)
                                tp3 = read(PathFC & "/tp/" & thedateNEWSTR & thetimeNEWSTR & "/tp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3STR)
                                cp1 = read(PathFC & "/cp/" & thedateNEWSTR & thetimeNEWSTR & "/cp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                cp3 = read(PathFC & "/cp/" & thedateNEWSTR & thetimeNEWSTR & "/cp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3STR)
                                u1 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                u2 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                u3 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3STR)
                                v1 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                v2 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                v3 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3STR)
                                cape1 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                cape2 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                cape3 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3STR)
                                sr1 = read(PathFC & "/sr/" & thedateNEWSTR & thetimeNEWSTR & "/sr" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1srSTR)
                                sr3 = read(PathFC & "/sr/" & thedateNEWSTR & thetimeNEWSTR & "/sr" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3srSTR)

                                #Compute the 12 hourly fields
                                print("COMPUTING")
                                print("Computing the required parameters (FER, cpr, tp, wspd700, cape, sr)...")
                                TP = (tp3 - tp1) * 1000
                                CP = (cp3 - cp1) * 1000
                                U700 = 0.5 * ((0.5*u1) + u2 + (0.5*u3))
                                V700 = 0.5 * ((0.5*v1) + v2 + (0.5*v3))
                                WSPD = sqrt((U700**2)+(V700**2))
                                CAPE = 0.5 * ((0.5*cape1) + cape2 + (0.5*cape3))
                                SR = (sr3 - sr1) / 86400

                                #Select the nearest grid-point from the rainfall observations
                                print("Selecting the nearest grid point to rainfall obs...")
                                TP_Ob = nearest_gridpoint(TP,obs)
                                CP_Ob = nearest_gridpoint(CP,obs)
                                WSPD_Ob = nearest_gridpoint(WSPD,obs)
                                CAPE_Ob = nearest_gridpoint(CAPE,obs)
                                SR_Ob = nearest_gridpoint(SR,obs)

                                #Select only the values that correspond to TP>=1
                                print('Selecting the values that correspond to tp >= 1 mm/{}h...'.format(Acc))
                                TP_Ob1 = filter(TP_Ob,TP_Ob>=1)
                                if count(values(TP_Ob1)) == 1:
                                    print('\nIMPORTANT NOTE!')
                                    print('No values of tp >= 1 mm/{}h.'.format(Acc))
                                    print('Case not considered. Go to the following forecast.')
                                else:
                                    print('\nSAVING')
                                    print('Saving the data in ', os.path.join(PathOUT, FileNameOUT), '...')
                                    CP_Ob1 = filter(CP_Ob,TP_Ob>=1)
                                    WSPD_Ob1 = filter(WSPD_Ob,TP_Ob>=1)
                                    CAPE_Ob1 = filter(CAPE_Ob,TP_Ob>=1)
                                    SR_Ob1 = filter(SR_Ob,TP_Ob>=1)

                                    #Compute other parameters
                                    obs1 = filter(obs,TP_Ob>=1)
                                    latObs_1 = latitudes(obs1)
                                    lonObs_1 = longitudes(obs1)
                                    CPr = CP_Ob1 / TP_Ob1  # [XXX]
                                    FER = (obs1 - TP_Ob1) / TP_Ob1  # [XXX]

                                    #Saving the output file in ascii format
                                    vals_TP = values(TP_Ob1)
                                    vals_CP = values(CP_Ob1)
                                    vals_OB = values(obs1)
                                    vals_FER = values(FER)
                                    vals_CPr = values(CPr)
                                    vals_WSPD = values(WSPD_Ob1)
                                    vals_CAPE = values(CAPE_Ob1)
                                    vals_SR = values(SR_Ob1)  # [XXX] What does values() do?

                                    n = count(vals_FER)
                                    obsUSED = obsUSED + n
                                    for i in range(1, n + 1):  # [XXX] Make it zero-index based
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

                    step1STR = "%02d".format(step1)
                    step2STR = "%02d".format(step2)
                    step3STR = "%02d".format(step3)
                    step4STR = "%02d".format(step4)
                    step5STR = "%02d".format(step5)

                    #Defining the parameters for the rainfall observations
                    validDateF = thedateNEW + (thetimeNEW/24) + (step5/24)
                    DateVF = validDateF.strftime("%Y%m%d")
                    HourVF = validDateF.strftime("%H")  # [XXX]
                    print("RAINFALL OBS PARAMETERS")
                    print("Validity date/time (end of the ", AccSTR, " hourly period) = ", validDateF)

                    #Looking for no repetions in the computed dates and times
                    checkNoRepeat = (counterValidTimes = number(validDateF, "yyyymmddHH"))
                    if sum(vector(checkNoRepeat)) > 0:
                        print("Valid Date and Time already computed.")
                        print("Case not considered. Go to the following forecast.")
                    else:
                        counterValidTimes = counterValidTimes & [number(validDateF, "yyyymmddHH")]
                        dirOBS = os.path.join(PathOBS, AccSTR, DateVF)
                        fileOBS = 'PPT{0}_obs_Global_{1}{2}.geo'.format(AccSTR, DateVF, HourVF)

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
                                tp1 = read(PathFC & "/tp/" & thedateNEWSTR & thetimeNEWSTR & "/tp" & "_" & thedateNEWSTR &  "_" & thetimeNEWSTR & "_" & step1STR)
                                tp5 = read(PathFC & "/tp/" & thedateNEWSTR & thetimeNEWSTR & "/tp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step5STR)
                                cp1 = read(PathFC & "/cp/" & thedateNEWSTR & thetimeNEWSTR & "/cp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                cp5 = read(PathFC & "/cp/" & thedateNEWSTR & thetimeNEWSTR & "/cp" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step5STR)
                                u1 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                u2 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                u3 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3STR)
                                u4 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step4STR)
                                u5 = read(PathFC & "/u700/" & thedateNEWSTR & thetimeNEWSTR & "/u700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step5STR)
                                v1 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                v2 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                v3 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3STR)
                                v4 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step4STR)
                                v5 = read(PathFC & "/v700/" & thedateNEWSTR & thetimeNEWSTR & "/v700" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step5STR)
                                cape1 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                cape2 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step2STR)
                                cape3 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step3STR)
                                cape4 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step4STR)
                                cape5 = read(PathFC & "/cape/" & thedateNEWSTR & thetimeNEWSTR & "/cape" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step5STR)
                                sr1 = read(PathFC & "/sr/" & thedateNEWSTR & thetimeNEWSTR & "/sr" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step1STR)
                                sr5 = read(PathFC & "/sr/" & thedateNEWSTR & thetimeNEWSTR & "/sr" & "_" & thedateNEWSTR & "_" & thetimeNEWSTR & "_" & step5STR)

                                #Compute the 24 hourly fields
                                print('\nCOMPUTING')
                                print('Computing the required parameters (FER, cpr, tp, wspd700, cape, sr)...')
                                TP = (tp5 - tp1) * 1000
                                CP = (cp5 - cp1) * 1000
                                U700 = ((0.5*u1) + u2 + u3 + u4 + (0.5*u5)) / 4
                                V700 = ((0.5*v1) + v2 + v3 + v4 + (0.5*v5)) / 4
                                WSPD = sqrt((U700**2)+(V700**2))
                                CAPE = ((0.5*cape1) + cape2 + cape3 + cape4 + (0.5*cape5)) / 4
                                SR = (sr5 - sr1) / 86400

                                #Select the nearest grid-point from the rainfall observations
                                print('Selecting the nearest grid point to rainfall obs...')
                                TP_Ob = nearest_gridpoint(TP,obs)
                                CP_Ob = nearest_gridpoint(CP,obs)
                                WSPD_Ob = nearest_gridpoint(WSPD,obs)
                                CAPE_Ob = nearest_gridpoint(CAPE,obs)
                                SR_Ob = nearest_gridpoint(SR,obs)

                                #Select only the values that correspond to TP>=1
                                print('Selecting the values that correspond to tp >= 1 mm/{}h...'.format(Acc))
                                TP_Ob1 = filter(TP_Ob,TP_Ob>=1)
                                if count(values(TP_Ob1)) == 1:
                                    print('\nIMPORTANT NOTE!')
                                    print('No values of tp >= 1 mm/{}h.'.format(Acc))
                                    print("Case not considered. Go to the following forecast.")
                                else:
                                    print("SAVING")
                                    print("Saving the data in ", os.path.join(PathOUT, FileNameOUT), '...')
                                    CP_Ob1 = filter(CP_Ob,TP_Ob>=1)
                                    WSPD_Ob1 = filter(WSPD_Ob,TP_Ob>=1)
                                    CAPE_Ob1 = filter(CAPE_Ob,TP_Ob>=1)
                                    SR_Ob1 = filter(SR_Ob,TP_Ob>=1)

                                    #Compute other parameters
                                    obs1 = filter(obs,TP_Ob>=1)
                                    latObs_1 = latitudes(obs1)
                                    lonObs_1 = longitudes(obs1)
                                    CPr = CP_Ob1 / TP_Ob1
                                    FER = (obs1 - TP_Ob1) / TP_Ob1

                                    #Saving the output file in ascii format
                                    vals_TP = values(TP_Ob1)
                                    vals_CP = values(CP_Ob1)
                                    vals_OB = values(obs1)
                                    vals_FER = values(FER)
                                    vals_CPr = values(CPr)
                                    vals_WSPD = values(WSPD_Ob1)
                                    vals_CAPE = values(CAPE_Ob1)
                                    vals_SR = values(SR_Ob1)

                                    n = count(vals_FER)
                                    obsUSED = obsUSED + n
                                    for i in range(1, n + 1):  # [XXX] Make it zero-index based
                                        data = map(str, [DateVF, HourVF, vals_OB[i], latObs_1[i], lonObs_1[i], vals_FER[i], vals_CPr[i], vals_TP[i], vals_WSPD[i], vals_CAPE[i], vals_SR[i], 'NaN'])
                                        Output_file.write('\t'.join(data) + '\n')

            print('\n' + '*'*80)

print('Number of observations in the whole training period:', obsTOT)
print('Number of observations actually used in the training period (that correspond to tp >= 1 mm/{0}h: {1}'.format(Acc, obsUSED))

Output_file.write('\nNumber of observations in the whole training period: {}\n'.format(obsTOT))
Output_file.write('Number of observations actually used in the training period (that correspond to tp >= 1 mm/{0}h): {1}'.format(Acc, obsUSED))