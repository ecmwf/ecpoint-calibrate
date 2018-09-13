%% MODULE 1

% The user does not know anything about the structure of the DT. Therefore,
% the user must follow some procedures to determine the breakpoints that 
% will define the weather types.


%%

close all
clear
clc

disp('************')
disp('* MODULE 1 *')
disp('************')

disp(newline)
disp('The user does not know anything about the structure of the DT.')
disp('Therefore, the user must follow some procedures to determine the')
disp ('breakpoints that will define the weather types.')

% Inputs from the user
disp('Do you want to use the default values for Module 1? ')
a = input('Select 1 to use the default values, Select 0 otherwise: ');
if a == 1
    NumSubMem = 100; % No. of sub-memebers to create per mapping function
    MinNumCases = 10; % Minimum number of cases per sub-member in the mapping functions
    NumSubSamples = 20; % No. of sub-samples to analyse to define the breakpoints
else
    NumSubMem = input('No. of sub-memebers to create per mapping function, NumSubMem: ');
    MinNumCases = input('Minimum number of cases per sub-member in the mapping functions, MinNumCases: ');
    NumSubSamples = input('No. of sub-samples to analyse to define the breakpoints, NumSubSamples: ');
end

% Load the data 
load InputData_Test.mat % .mat is a file for matlab (somewhere else use an ascii file)

% Select the variables that are going to be predictand and predictors
TypeOfPredictand = "Forecast Error Ratio"; % The user can select between "Forecast Error Ratio" or "Forecast Error"
Predictand = {"FER"};
Predictors = {"CPR"; "TP"; "WSPD700"; "CAPE"; "SR24h"};


%% Creation of the variable that contains the predictand

if strcmp(TypeOfPredictand,"Forecast Error Ratio")
    bin = [-1.1; -0.99; -0.75; -0.5; -0.25; 0.25; 0.5; 0.75; 1; 1.5; 2; 3; 5; 10; 25; 50; 1000];
elseif strcmp(TypeOfPredictand,"Forecast Error")
    bin = [-50.5; -40.5; -30.5; -20.5; -15.5; -10.5; -5.5; -4.5; -3.5; -2.5; -1.5; -0.5; 0.5; 1.5; 2.5; 3.5; 4.5; 5.5; 10.5; 15.5; 20.5; 30.5; 40.5; 50.5];
else 
    disp("Not recognized value for the variable 'TypeOfPredictand'")
    disp("Accepted entrances are 'Forecast Error Ratio' or 'Forecast Error'")
end
eval(['VarPND', strcat('=', char(string(Predictand)), ';')]) % VarPND stores the predictand
SizeData = length(VarPND);


%% Creation of the variable that contains the predictors

m = length(Predictors);
VarPOR = zeros(SizeData,m); % VarPOR stores the predictors
for i = 1 : m
    eval(strcat('VarPOR(:,', num2str(i), ')=', char(string(Predictors(i))), ';')) 
end


%% Definition of the breakpoints that will define the decision tree

IndP = 1; % Index for the predictors
NumBranch = 1;

while IndP <= m
    
    disp(newline)
    disp("******")
    disp(strcat('Analysing predictor n.', num2str(IndP), ' -> ', char(string(Predictors(IndP)))))
    disp("******")
    
    % Selection of the branch "Var2Analyse" of the decision tree that is 
    % going to be analysed
    [VarPND2Analyse, VarPOR2Analyse, titleBranch] = branch(VarPND, VarPOR, IndP, Predictors);
    
    
    % Print some useful statistics for "VarPOR2Analyse"
    SizeVar = length(VarPOR2Analyse);
    MinVar = min(VarPOR2Analyse);
    MaxVar = max(VarPOR2Analyse);
    disp(newline)
    disp('Some useful statistics')
    disp(strcat('Size of the variable to analyse=', char(string(SizeVar))))
    disp(strcat('Minimum value=', char(string(MinVar))))
    disp(strcat('Maximum value=', char(string(MaxVar))))
    
    
    % Split "Var2Analyse" in the sub-samples that are going to be analysed 
    % to define the breakpoints
    EstNumElem = MinNumCases * NumSubMem; % Minimum no. of cases in each sub-sample
    [SortPND, SortPOR, PosAll, PosBP, NumSubSamples] = split(VarPND2Analyse, VarPOR2Analyse, EstNumElem, NumSubSamples);
    
    
    % Definition of the suggested breakpoints
    [BreakPoints] = DefBP(SortPND, SortPOR, PosAll, PosBP, TypeOfPredictand, bin);
    
    
    % The user should change the suggested breakpoints with more reasonable
    % values
    disp(newline)
    disp('The user might want to change the values of the suggested breakpoints.')
    [UserBP] = CustomBP(VarPND2Analyse, VarPOR2Analyse, IndP, Predictors, TypeOfPredictand);
    
    
    % Saving the breakpoints for the analised branch
    saveBP(IndP, NumBranch, titleBranch, Predictors, UserBP)
    
    % The user has the possibility to analyse the following predictor or
    % analyse more branches for the same predictor
    disp(newline)
    disp("Do you want to analyse more branches for the same predictor?")
    LogB = input('Select 1 to analyse more branches for the same predictor, select 0 to analyse the following predictor: ');
    close all
    
    if LogB == 0
        IndP = IndP + 1;
    end
    
    NumBranch = NumBranch + 1;

end


disp(newline)
disp(newline)
disp("**************************************************")
disp("                ANALYSIS COMPLETED!               ")
disp("The user has analysed all the selected predictors.")
disp("**************************************************")
