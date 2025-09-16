export interface RegisterDTO {
  username?: string;
  email?: string;
  password?: string;
}

export interface LoginDTO {
  email?: string;
  password?: string;
}

export interface ChangePasswordDTO {
  oldPassword?: string;
  newPassword?: string;
}

export interface ChangeEmailDTO {
  newEmail?: string;
  password?: string;
}

export interface UpdateProfileDTO {
  username?: string;
  avatarId?: string;
}
