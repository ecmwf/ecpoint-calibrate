function saveBP(IndP, NumBranch, titleBranch, Predictors, UserBP)

% Name of the file
FileName = strcat('Branch_', sprintf('%03d',NumBranch), '.txt');

% Saving the branch that the breakpoints correspond to
fid = fopen(FileName, 'w');
fprintf(fid,'BRANCH');
fprintf(fid, newline);
if IndP == 1
    fprintf(fid, "Top of the decision tree.");
else
    for i = 1 : length(titleBranch)
        fprintf(fid,titleBranch(i));
        fprintf(fid, newline);
    end
end

% Saving the name of the predictor that the breakpoints correspond to
fprintf(fid, newline);
fprintf(fid, newline);
fprintf(fid,strcat('BREAKPOINTS FOR -> ', char(string(Predictors(IndP)))));
fprintf(fid, newline);

% Saving the breakpoints
dlmwrite(FileName, UserBP, 'delimiter','\t','precision',3, '-append')
fclose(fid);