cd back
call start back.bat
cd ../
cd front
call start front.bat
cd ../
cd auth/authorization
call npm install
node app.js
pause
