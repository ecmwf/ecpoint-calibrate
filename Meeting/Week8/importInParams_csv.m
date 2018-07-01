% importInParams_csv imports the parameters related to the input file for 
% ecPoint - MatCal Toolbox contained in "InputFiles_csv/InputParams.csv"
%   
%   [TypeFile, PathFile, NameFile, FormatSpec] = importInputParamsCSV()
% 
%
% INPUTS
%
% No needed inputs. The only needed input is the name of the .csv file to 
% import. However, it is hard coded because it is part of the fixed
% structure of the toolbox.
%
%
% OUTPUTS
%
% TypeFile (string): type of input file.
%                    Valid values are 'mat' or 'ascii'.
%
% PathFile (string): path of the input file.
%                    Note that if the file is contained in the current  
%                    working directory there is no need to specify a path.
%
% NameFile (string): name of the input file.
%                    Do not include the extention of the file (either .mat 
%                    or .ascii).
%
% FormatSpec (string): format for the values in each columns of the input
%                      file.
%                      It is needed only when TypeFile = "ascii". For mat
%                      files it is ignore, therefore it can be left blank.


function [TypeFile, PathFile, NameFile, FormatSpec] = importInParams_csv()

% Open the text file
filename = './InputParams.csv';
fileID = fopen(filename,'r');

% Read the data
dataArray = textscan(fileID, '%s%s%s%s%[^\n\r]', 'Delimiter', '\t', 'HeaderLines', 0, 'ReturnOnError', false);
% Close the text file
fclose(fileID);

% Allocate imported array to variable names
TypeFile = dataArray{1,1};
TypeFile = char(TypeFile(2));
PathFile = dataArray{1,2};
PathFile = char(PathFile(2));
NameFile = dataArray{1,3};
NameFile = char(NameFile(2));
FormatSpec = dataArray{1,4};
FormatSpec = char(FormatSpec(2));