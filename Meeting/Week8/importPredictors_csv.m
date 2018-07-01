% importPredictorsCSV imports the parameters related to the predictors 
% contained in Predictors.csv
%
% [Pred_Description, Pred_ShortName, Pred_Range, Pred_Units] = importPredictorsCSV();
% 
% OUTPUTS
%
% Pred_Description (string): description (extended name) for the
%                            predictors
%
% Pred_ShortName (string): short name for the predictors
%
% Pred_Range (string): range of the accepted values for the predictors
%
% Pred_Units (string): predictor units

function [Pred_Description, Pred_ShortName, Pred_Range, Pred_Units] = importPredictors_csv()

% Open the text file
filename = 'Predictors.csv';
fileID = fopen(filename,'r');

% Read data
dataArray = textscan(fileID, '%s%s%s%s%s%[^\n\r]', 'Delimiter', ',');

% Close the text file
fclose(fileID);

% Allocate imported array to column variable names
Pred_Description = dataArray{:, 2};
Pred_Description = Pred_Description(2:end);
Pred_ShortName = dataArray{:, 3};
Pred_ShortName = Pred_ShortName(2:end);
Pred_Range = dataArray{:, 4};
Pred_Range = Pred_Range(2:end);
Pred_Units = dataArray{:, 5};
Pred_Units = Pred_Units(2:end);