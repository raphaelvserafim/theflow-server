export const NAME_TABLE_DB = {
  USER: {
    NAME: "User",
    COLUMNS: {
      ID: "user_id",
      NAME: "user_name",
      EMAIL: "user_email",
      DATE_REGISTRATION: "user_registration_date",
      PASSWORD: "user_password"
    }
  },
  SESSION: {
    NAME: "Session",
    COLUMNS: {
      USER: "user",
      TOKEN: "session_token",
      DATE: "session_date",
      STATUS: "session_status",
    }
  },
  NEW_PASSWORD: {
    NAME: "NewPassword",
    COLUMNS: {
      USER: "user",
      TOKEN: "new_password_token",
      DATE: "new_password_date",
      STATUS: "new_password_status"
    }
  },
  HISTORIC: "Historic",
};