cd backend
virtualenv --python python3 my-venv
source my-venv/bin/activate
sh server.sh
cd ../
cd frontend
ng serve --disable-host-check