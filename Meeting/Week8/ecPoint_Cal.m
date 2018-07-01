%% ecPoint - MatCal Toolbox
%
% _ecPoint-MatCal Toolbox is a Matlab Toolbox that trains a new 
% physically-based post-processing system (ecPoint) which produces
% forecasts for meteorological variables at a point scale._
%
% ecPoint-MatCal studies the relationship between meteorological/
% geographical parameters (predictors), and the spatial sub-grid
% variability of the post-processed parameter. The predictors can be
% raw model outputs or derived from raw model. This relashionship is 
% determined by the definition of Weather Types (WTs) organized in a 
% tree-like structure (Decision Tree, DT).
%
% The training system is organized in the following two modules:
% # The user does not know anything about the structure of the DT.
%   Therefore, the user will follow certain steps to construct the DT from
%   the beginning.
%
% # The user knows the structure of the DT and wants to test it. Therefore,
%   the user will introduce the WTs of the DT to plot and evaluate them.
%

clear
clc

disp('*******************************************************************')
disp('*                                                                 *')
disp('*                  ecPoint-Cal (Matlab Toolbox)                   *')
disp('*                                                                 *')
disp('*******************************************************************')

disp(' ')
disp('ecPoint-MatCal Toolbox is a Matlab Toolbox that trains a new')
disp('physically-based post-processing system (ecPoint) which produces')
disp('forecasts for meteorological variables at a point scale.')

disp(' ')
disp('ecPoint-MatCal studies the relationship between meteorological/')
disp('geographical parameters (predictors), and the spatial sub-grid')
disp('variability of the post-processed parameter. The predictors can be')
disp('raw model outputs or derived from raw model.')
disp('This relashionship is determined by the definition of Weather Types')
disp('(WTs) organized in a tree-like structure (Decision Tree, DT).')

disp(' ')
disp('The training system is organized in the following two modules:')
disp('  1. The user does not know anything about the structure of the DT.') 
disp('     Therefore, the user will follow certain steps to construct the')
disp('     DT from the beginning.')
disp('  2. The user knows the structure of the DT and wants to test it.')
disp('     Therefore, the user will introduce the WTs of the DT to plot')
disp('     and evaluate them.')

%% 
% 
% *INPUT PARAMETERS*
%
% The user is asked to insert the parameters needed to read the input file.
% The user must edit the file |InputFiles_csv/InputParams.csv| provided 
% with the toolbox.
%
% _Description of the parameters in_ |InputFiles_csv/InputParams.csv|
%
% * TypeFile (string): type of input file.
%                      Valid values are 'mat' or 'ascii'.
%
% * PathFile (string): path of the input file.
%                      Note that if the input file is contained in the   
%                      current working directory there is no need to specify 
%                      a path.
%
% * NameFile (string): name of the input file.
%                      Do not include the extention of the file (either .mat 
%                      or .ascii).
%
% * FormatSpec (string): format for the values in each columns of the input
%                        file.
%                        It is needed only when TypeFile = "ascii". For mat
%                        files it is ignore, therefore it can be left blank.
%
% The function *importInParams_csv.m* will import into the workspace all  
% the information contained in |InputFiles_csv/InputParams.csv|.
% 
% NOTE: the user does not need to care about the type of the parameters in
%       the .csv file because they are internally selected by the function 
%       accordingly to the needs of the code.
%
% NOTE: More details about *importInParams_csv.m* can be found in the 
%       Appendix "Functions_ImportCSV".
%
% *** Test files provided with the ecPoint-MatCal Toolbox ***
% * |TestFiles/InputData_Test.mat| -> MAT-file example
% * |TestFiles/InputData_Test_ascii2mat.ascii| -> ASCII-file example
% Add picture of the .csv file with both cases. (to delete)

disp (' ')

disp('********************')
disp('* INPUT PARAMETERS *')
disp('********************')

% Import the parameters in the file "InputFiles_csv/InputParams.csv"
disp('Reading InputParams.csv that contains the parameters for the input file...')
[TypeFile, PathFileIN, NameFileIN, FormatSpec] = importInParams_csv();

% Display the features of the file to import
FileIn = strcat(PathFileIN, NameFileIN, '.', TypeFile);
disp(' ')
disp(strcat('The user is uploading the file', {' '}, FileIn))

if strcmp(TypeFile,'mat') %compare whether two char are equal
    
    %Load the mat file
    disp('The file can be directly loaded.')
    load (FileIn);
    
elseif strcmp(TypeFile,'ascii')
    
    %Convert the ascii file into a mat file
    disp(' ')
    disp('The file cannot be directly loaded.')
    disp('The ascii file needs to be converted into a mat file.')
    disp('Converting the ascii file into a mat file...')
    disp('(NOTE: this can take several minutes depending on the size of the ascii file.)')
    FileOut = strcat(PathFileIN, NameFileIN, '.mat');
    importASCII(FileIn, FormatSpec, FileOut);
    disp('Convertion completed.')
    
    %Load the mat file
    disp(' ')
    disp('Loading the mat file...')
    FileIn = strcat(PathFileIN, NameFileIN, '.mat');
    disp(FileIn)
    load (FileIn);
   
else
    
    disp('Not valid value for "TypeFile".') 
    disp('Check the field in "InputFiles_csv/InputParams.csv".')
    error('Valid values are "mat" or "ascii".')

end

% Defining the size of the training dataset
Vars_WS = fieldnames(load(FileIn));
eval(['temp = ', char(Vars_WS(1)), ';']);
TrainData_size = length(temp);
clear temp

disp(' ')
disp('The mat file cointains the following variables... ')
disp(Vars_WS)
disp (strcat('The training dataset contains', {' '}, num2str(TrainData_size), ' realizations.'))


%%
%
% *PREDICTORS*
%
% The user is asked to define which uploaded variables are going to be
% considered as predictors, as well as a description, a short name, the 
% range of valid values and the units. For example, if rainfall is
% considered as predictor, the user might consider:
% Description = Total Precipitation;
% ShortNames = TP;
% Range = 0 to inf;
% Units = mm.
%
% The user must edit the file |InputFiles_csv/Predictors.csv| provided 
% with the toolbox.
%
% _Description of the parameters in_ |InputFiles_csv/Predictors.csv|
%
% * Pred_Description (string): description for the predictors
%
% * Pred_ShortName (string): short name for the predictors
%
% * Pred_Range (string): range of the valid values for the predictors
%
% * Pred_Units (string): units for the predictors
%
% The function *importPredictors_csv.m* will import into the workspace all  
% the information contained in |InputFiles_csv/Predictors.csv|.
%
% NOTE: the user does not need to care about the type of the parameters in
%       the .csv file because they are internally selected by the function 
%       accordingly to the needs of the code.
%
% NOTE: More details about *importPredictors_csv.m* can be found in the 
%       Appendix "Functions_ImportCSV".
%
% *** Test case provided with the ecPoint-MatCal Toolbox ***
% The following variables are selected as predictors: 
% CPR; TP; WSPD700; CAPE; SR24h; TimeLST.
% This is the order with which they will be consider to build the DT.
% Add picture of the .csv file with both cases. (to delete)

disp(' ')

disp('**************')
disp('* PREDICTORS *')
disp('**************')

% Import the parameters in the file "InputFiles_csv/Predictors.csv"
disp('Reading Predictors.csv that contains the parameters selected as predictors...')
[Pred_Description, Pred_ShortName, Pred_Range, Pred_Units] = importPredictors_csv();
Pred_Num = length(Pred_Description);

% Display the features of the file to import
disp(' ')
disp(strcat(num2str(Pred_Num), ' variables has been selected as predictors:'));
disp(Pred_ShortName)
disp(' ')

% Creation the matrix that contains all the predictors
% NOTE: The order in which the parameters will appear in the DT depends on
% the order in which they are listed in the file "Predictors.csv"
Pred_Matrix = zeros(TrainData_size, Pred_Num);
for i = 1 : Pred_Num
    eval(['temp', strcat('=', char(Pred_ShortName(i)), ';')])
    Pred_Matrix(:,i) = temp; 
end


%%
%
% *MODULES*
%
% The user is asked to select the module to run.
%
% * MODULE 1. The user do not know anything about the structure of the DT. 
%             Therefore, the user will follow certain steps to construct 
%             the DT from the beginning.
% * MODULE 2. The user knows the structure of the DT and wants to test it.
%             Therefore, the user will introduce the WTs of the DT to plot 
%             and evaluate them.
% Add a picture of the command window selecting 1 or 2 (to delete)

disp('***********')
disp('* MODULES *')
disp('***********')

disp('Module 1. The user does not know anything about the structure of the DT.') 
disp('          The user will construct the DT from the beginning.')
disp('Module 2. The user knows the structure of the DT and wants to test it.')
disp('          The user will introduce the WTs of the DT.')

disp(' ')
disp('Select the module to run.');
module_index = input('Enter 1 for "Module 1" or 2 for "Module 2": ');

if module_index == 1
    
    disp('The user will build the DT without any pre-knowledge about its structure.')
    Module1_Script

elseif module_index == 2
    
    disp('The user will plot the WTs from a pre-defined DT.')
    Module2_Script

else
    
    disp('Not valid value.') 
    error('Valid values are 1 for "Module 1" or 2 for "Module 2".')

end