import api from "./auth";

// ShippingAddress.ts
export interface ShippingAddress {
  receiverName: string;
  phoneNumber: string;
  postCode: string;
  roadAddress: string;
  detailAddress: string;
}

export interface UserProfileResponseDto {
  id: number | null;
  username: string | null;
  nickname: string | null;
  picture: string | null;
  email: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const getUserProfile = async (): Promise<UserProfileResponseDto> => {
  const userProfileResponse = api.get("/users/profile");
  console.log((await userProfileResponse).data);
  return (await userProfileResponse).data;
};
