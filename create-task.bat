@echo off
setlocal enabledelayedexpansion
set CURRENT_PATH=%~dp0

cd %CURRENT_PATH%

mkdir tmp 2> nul

@rem �o�b�`���s
call:createTask "�Ζ��󋵊m�F" %CURRENT_PATH%exec-dl.bat 01:31

goto :eof

@rem �����̃^�X�N�X�P�W���[�����쐬����
@rem ��1���� �^�X�N��
@rem ��2���� �t�@�C���p�X �t���p�X�Ŏ��s����
@rem ��3���� ���s���ԑ� HH:MM �`���Ŏ��s����
:createTask
set TASK_NAME=%~1
set BATCH_FILE=%2
set BATCH_START=%3

set BEFORE_STRING=IgnoreNew
set AFTER_STRING=Parallel

set INPUT_FILE=%CURRENT_PATH%tmp\task.xml
set OUTPUT_FILE=%CURRENT_PATH%tmp\renewed.xml

@rem �o�̓t�@�C���폜
type nul > %OUTPUT_FILE%

@rem ��{task�쐬
schtasks /CREATE /SC DAILY /TN %TASK_NAME% /TR %BATCH_FILE% /ST %BATCH_START% /F > nul

@rem ��{task���t�@�C���o��
schtasks /QUERY /TN %TASK_NAME% /XML > %INPUT_FILE%

@rem �t�@�C���̍X�V
for /f "delims=" %%a in (%INPUT_FILE%) do (
set line=%%a
echo !line:%BEFORE_STRING%=%AFTER_STRING%!>>%OUTPUT_FILE%
)

@rem �^�X�N�̍X�V
schtasks /CREATE /TN %TASK_NAME% /XML %OUTPUT_FILE% /F

@rem ���ԃt�@�C���̍폜
del %INPUT_FILE%
del %OUTPUT_FILE%
exit /b
