function [SortPND, SortPOR, PosAll, PosBP, NumSubSamples] = split(VarPND2Analyse, VarPOR2Analyse, EstNumElem, NumSubSamples)


% Verify that the analysis does not start with a dataset that is already
% too small
if EstNumElem < (length(VarPOR2Analyse))
    
    NumElem = round(length(VarPOR2Analyse)/NumSubSamples); % No. of cases in each sub-sample
    
    % Verify that the no. of cases in each sub-sample is not too small
    while NumElem < EstNumElem
        disp(newline)
        disp("The size of the sub-samples to analyse is too small.")
        disp(strcat('Minimum no. of cases in each sub-sample: ', num2str(EstNumElem)))
        disp(strcat('Size of the sub-samples to analyse: ', num2str(NumElem)))
        NumSubSamples = input('Please, provide a smaller number of sub-samples: ');
        NumElem = round(length(VarPOR2Analyse)/NumSubSamples);
    end
    
else
    
    disp('The dataset to analyse is too small. No further splits should be applied.')
    return

end


% Display some useful information on the screen
disp(newline)
disp(strcat('Number of considered sub-samples: ', num2str(NumSubSamples)))
disp(strcat('Number of cases in each sub-sample: ', num2str(NumElem)))
disp(strcat('Minimum number of cases in each sub-sample: ', num2str(EstNumElem)))


% Add random values to the data to 
% Add a function for the randomization of the cases with the same value
% Remember to bring back the data to the original precision


% Split the dataset to analyse in sub-samples
[SortPOR, Ind] = sort(VarPOR2Analyse);
SortPND = VarPND2Analyse(Ind);
PosAll = (1:length(SortPOR))'; % Position of all the data
PosBP = [(1:NumElem:length(SortPOR))'; length(SortPOR)]; %Position of the possible breakpoints