@echo off
setlocal enabledelayedexpansion
set CURRENT_PATH=%~dp0

cd %CURRENT_PATH%

mkdir tmp 2> nul

@rem バッチ実行
call:createTask "勤務状況確認" %CURRENT_PATH%exec-dl.bat 01:31

goto :eof

@rem 日次のタスクスケジュールを作成する
@rem 第1引数 タスク名
@rem 第2引数 ファイルパス フルパスで実行する
@rem 第3引数 実行時間帯 HH:MM 形式で実行する
:createTask
set TASK_NAME=%~1
set BATCH_FILE=%2
set BATCH_START=%3

set BEFORE_STRING=IgnoreNew
set AFTER_STRING=Parallel

set INPUT_FILE=%CURRENT_PATH%tmp\task.xml
set OUTPUT_FILE=%CURRENT_PATH%tmp\renewed.xml

@rem 出力ファイル削除
type nul > %OUTPUT_FILE%

@rem 基本task作成
schtasks /CREATE /SC DAILY /TN %TASK_NAME% /TR %BATCH_FILE% /ST %BATCH_START% /F > nul

@rem 基本taskをファイル出力
schtasks /QUERY /TN %TASK_NAME% /XML > %INPUT_FILE%

@rem ファイルの更新
for /f "delims=" %%a in (%INPUT_FILE%) do (
set line=%%a
echo !line:%BEFORE_STRING%=%AFTER_STRING%!>>%OUTPUT_FILE%
)

@rem タスクの更新
schtasks /CREATE /TN %TASK_NAME% /XML %OUTPUT_FILE% /F

@rem 中間ファイルの削除
del %INPUT_FILE%
del %OUTPUT_FILE%
exit /b
