% import_ThrWTs_csv imports the weather types from a predifined 
% decition tree contained in ThresholdsWeatherTypes.csv
%
%   [thrL, thrH] = importThrWTs_CSV()
% 
% OUTPUTS
%
% thrL (number): lower thresholds for the selected predictors.
%                Matrix, [n_thr X n_pred]
%                n_thr = number of thresholds to test;
%                n_pred = number of selected predictors.
%
% thrH (number): upper thresholds for the selected predictors.
%                Matrix, [n_thr X n_pred]
%                n_thr = number of thresholds to test;
%                n_pred = number of selected predictors.


function [thrL, thrH] = importThrWTs_csv()

% Open the text file.
filename = 'WeatherTypes.csv';
fileID = fopen(filename,'r');

% Read data
formatSpec = '%f%f%f%f%f%f%f%f%f%f%[^\n\r]';
dataArray = textscan(fileID, formatSpec, 'Delimiter', '\t', 'EmptyValue', NaN, 'HeaderLines', 1, 'ReturnOnError', false, 'EndOfLine', '\r\n');

% Close the text file.
fclose(fileID);

% Create output variable
WeatherTypes = [dataArray{1:end-1}];
thrL = WeatherTypes(:,1:2:end-1);
thrH = WeatherTypes(:,2:2:end);

% Verifying the consistency of the matrixes
[mL, nL] = size(thrL);
[mH, nH] = size(thrH);

if mL ~= mH || nL ~= nH
    
    disp('The dimensions of the matrixes that contain the lower and the')
    disp('upper thresholds that define the weather types are inconsistent.')
    errot('Check the inserted values in the file "WeatherTypes.csv".')
    
end