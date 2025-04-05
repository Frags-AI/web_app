export interface CustomError extends Error {
    status?: number
    code?: number
    details?: string
}

export interface ClerkUserCreatedEvent {
    type: 'user.created';
    data: {
      birthday: string;
      created_at: number;
      email_addresses: {
        email_address: string;
        id: string;
        linked_to: any[];
        object: 'email_address';
        verification: {
          status: 'verified' | 'unverified';
          strategy: string;
        };
      }[];
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
      phone_numbers: any[];
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
    event_attributes: {
      http_request: {
        client_ip: string;
        user_agent: string;
      };
    };
    object: 'event';
    timestamp: number;
}

export interface ClerkUserDeletedEvent {
    type: 'user.deleted';
    data: {
      deleted: boolean;
      id: string;
      object: 'user';
    };
    event_attributes: {
      http_request: {
        client_ip: string;
        user_agent: string;
      };
    };
    object: 'event';
    timestamp: number;
}

export interface ClerkUserUpdatedEvent {
    type: 'user.updated';
    data: {
      birthday: string;
      created_at: number;
      email_addresses: {
        email_address: string;
        id: string;
        linked_to: any[];
        object: 'email_address';
        reserved: boolean;
        verification: {
          attempts: number | null;
          expire_at: number | null;
          status: 'verified' | 'unverified' | string;
          strategy: string;
        };
      }[];
      external_accounts: any[];
      external_id: string | null;
      first_name: string;
      gender: string;
      id: string;
      image_url: string;
      last_name: string | null;
      last_sign_in_at: number | null;
      object: 'user';
      password_enabled: boolean;
      phone_numbers: any[];
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
    event_attributes: {
      http_request: {
        client_ip: string;
        user_agent: string;
      };
    };
    object: 'event';
    timestamp: number;
}