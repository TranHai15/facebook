import React from "react";
import ProfilePage from "./Profile";
import ProfileLayout from "../../../Layouts/ProfileLayout/ProfileLayout";

export default function index() {
  return (
    <ProfileLayout>
      <ProfilePage />
    </ProfileLayout>
  );
}
