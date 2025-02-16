export type ClerkWebhookBody = {
  birthday: string;
  created_at: number;
  email_addresses: { id: string; email_address: string }[];
  external_accounts: any[];
  external_id: string;
  first_name: string;
  gender: string;
  id: string;
  image_url: string;
  last_name: string;
  last_sign_in_at: number;
  object: 'user';
  password_enabled: boolean;
  phone_numbers: { id: string; phone_number: string }[];
  primary_email_address_id: string;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  private_metadata: Record<string, any>;
  profile_image_url: string;
  public_metadata: Record<string, any>;
  two_factor_enabled: boolean;
  unsafe_metadata: Record<string, any>;
  updated_at: number;
  username: string | null;
  web3_wallets: any[];
};

export type ClerkWebhookEvent = {
  data: ClerkWebhookBody;
  event_attributes: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };
  object: 'event';
  timestamp: number;
  type:
    | 'user.created'
    | 'user.updated'
    | 'user.deleted'
    | 'role.created'
    | 'role.updated'
    | 'role.deleted'
    | 'email.created';
};
