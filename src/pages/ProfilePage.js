

import React from 'react';
import {
  Card,
  CardBody,
  Image,
  Button,
  Label,
  Input,
} from '@windmill/react-ui';

const ProfilePage = () => {
  return (
    <div className="flex  justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm mx-auto">
       
        <CardBody>
          <h2 className="text-xl font-semibold text-center">John Doe</h2>
          <p className="text-center text-gray-600">Software Engineer</p>
          <div className="mt-4">
            <Label>
              <span>Email</span>
              <Input className="mt-1" placeholder="john.doe@example.com" disabled />
            </Label>
          </div>
          <div className="mt-4">
            <Label>  
              <span>Phone</span>
              <Input className="mt-1" placeholder="(123) 456-7890" disabled />
            </Label>
          </div>
          <div className="mt-4">
            <Button className="w-full" layout="outline">
              Edit Profile
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePage;
