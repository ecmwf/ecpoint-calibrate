%% MODULE 2
%
% The user knows the structure of the DT and wants to test it. Therefore,
% the user will introduce the WTs of the DT to plot and evaluate them.
%
% The user has to edit the file _ThresholdsWeatherTypes.csv_ provided with the toolbox.
% The function *importDTandWT_CSV.m* will import automatically all the 
% information contained in the .csv file into the workspace. (NOTE: the 
% user do not need to care about the type of the parameters in the .csv 
% file because they are internally selected by the function accordingly to 
% the needs of the code).
%
%
% _Description of the parameters in_ |mod_DTandWT.csv|
%
% * mod (number): numerical code for the module to run.
%
% * thrL (number): lower thresholds for the selected predictors.
%                  Matrix, [n_thr X n_pred]
%                  n_thr = number of thresholds to test;
%                  n_pred = number of selected predictors.
%
% * thrH (number): upper thresholds for the selected predictors.
%                  Matrix, [n_thr X n_pred]
%                  n_thr = number of thresholds to test;
%                  n_pred = number of selected predictors.
%
% NOTE: if the user wants to select [pred_name]<thr, select thrL=-9999;
%       if the user wants to select [pred_name]>=thr, select thrH=9999;
%
% From the example in the previous sections, now let's create the weather
% types from a simple DT.






%%
clc
disp(' ')
disp('************')
disp('* MODULE 2 *')
disp('************')

disp('The user either knows the definitive structure of the DT or wants to')
disp('test a particular DT. Therefore, the user will introduce in the')
disp('training system the thresholds for every selected predictor in order')
disp(' to create the WTs that correspond to that particular DT and evaluate')
disp(' them.')

disp(' ')
disp('NOTE: ')
disp('The convention adopted to compute Pred < thr or Pred >= thr is: ')
disp('    Pred < thr => thrL = -9999 ; thrH = thr')
disp('    Pred >= thr => thrL = -thr ; thrH = 9999')
disp(' ')

DecisionTree_thrL = [];
DecisionTree_thrH = [];

% Reading the weather types
disp('Reading the weather types from WeatherTypes.csv...')
[thrL, thrH] = importThrWTs_csv();
[~,n] = size(thrL);
    
% Verify the consistency of the number of assigned thresholds and the
% number of selected predictors
if n ~= Pred_Num
    disp('The number of thresholds that define the weather types are')
    disp('not consistent with the selected number of predictors.')
    error('Check the number of predictors considered in the file "ThresholdsWeatherTypes.csv".')
end

% Creating the matrix that contains the thresholds that define the WTs
% (complete decision tree)
disp(' ')
disp('Creating the decision tree...')
[thrL_matrix, thrH_matrix] = createWT_completeDT(thrL, thrH);
[WT_Num,~] = size(thrL_matrix);

% Creating the weather types
disp(' ')
disp(strcat('Creating', {' '}, num2str(WT_Num), ' weather types...'))
y_lim = input('Enter the upper limit for y-axes for the mapping functions (valid values between 0 and 1): ');
%Pred_Matrix = [CPR, TP, WSPD700, CAPE, SR24h];

for i = 1 : WT_Num
    thrL = thrL_matrix(i,:);
    thrH = thrH_matrix(i,:);
    [~,~] = hist_varFER(FER, Pred_Matrix, thrL, thrH, y_lim, Pred_ShortName);
end

% Display on the screen the description of the weather types
for i = 1 : WT_Num
    
    disp(' ')
    disp(strcat('WT n.', num2str(i)))
    
    for j = 1 : Pred_Num
        
        disp(strcat('Level n.', num2str(j)))
        disp(strcat('(', num2str(thrL_matrix(i,j)), '<=', Pred_ShortName{j}, '<', num2str(thrH_matrix(i,j)), ')'));
        
    end
    
end

% Analizing the weather types computed
disp(' ')
disp('On the screen the weather types from the decision tree selected')
disp('by the user are displayed. Take your time to analize them.')
disp('OPTIONAL NOTE ABOUT THE DISPLAYED FIGURES. ')
disp('The user has can delete some or all the displayed figures.')
disp('To close a particular figure type => close 1 (to close figure n.1)')
disp('To close all the figures type => close all')

% Save the decision tree
disp('Do you want to save the weather types in ascii format?')
SaveCode = input('Type 1 if "yes", type 0 if "no": ');
if SaveCode == 1
    WT_matrix = [thrL_matrix,thrH_matrix];
    disp(' ')
    disp('Saving the weather types in an ascii file...')
    importOutParams_csv(WT_matrix);
end