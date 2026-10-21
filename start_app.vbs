Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get current folder path dynamically
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)

' Set working directory to project folder and run server hidden
WshShell.CurrentDirectory = scriptPath
WshShell.Run "cmd /c node server.js", 0, False

' Wait 2 seconds for server to start
WScript.Sleep 2000

' Open application in browser
WshShell.Run "http://localhost:3000"