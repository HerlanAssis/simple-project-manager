make()
{
 cd $1; yarn; yarn run build; cd ../;
}

# ONLY in linux Alpine
apk add --update nodejs nodejs-npm yarn;

# Main folder for frontend
cd frontend/;
##
make 'client';
##
make 'project_manager';

#
cd ../; docker-compose up -d;