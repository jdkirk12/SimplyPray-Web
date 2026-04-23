export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      church_members: {
        Row: {
          church_id: string
          deactivated_at: string | null
          deactivated_by: string | null
          id: string
          joined_at: string
          last_seen_at: string | null
          role: string
          status: string
          user_id: string
        }
        Insert: {
          church_id: string
          deactivated_at?: string | null
          deactivated_by?: string | null
          id?: string
          joined_at?: string
          last_seen_at?: string | null
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          church_id?: string
          deactivated_at?: string | null
          deactivated_by?: string | null
          id?: string
          joined_at?: string
          last_seen_at?: string | null
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_members_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          created_at: string
          default_list_write_mode: string
          id: string
          landing_page_message: string | null
          logo_url: string | null
          max_seats: number
          name: string
          primary_color: string | null
          public_lists_enabled: boolean
          slug: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_list_write_mode?: string
          id?: string
          landing_page_message?: string | null
          logo_url?: string | null
          max_seats?: number
          name: string
          primary_color?: string | null
          public_lists_enabled?: boolean
          slug: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_list_write_mode?: string
          id?: string
          landing_page_message?: string | null
          logo_url?: string | null
          max_seats?: number
          name?: string
          primary_color?: string | null
          public_lists_enabled?: boolean
          slug?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          church_id: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_church_sponsored: boolean
          name: string
          updated_at: string
          visibility: string
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_church_sponsored?: boolean
          name: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          church_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_church_sponsored?: boolean
          name?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      list_subscriptions: {
        Row: {
          created_at: string
          hidden: boolean
          id: string
          list_id: string
          sort_order: number
          user_id: string
        }
        Insert: {
          created_at?: string
          hidden?: boolean
          id?: string
          list_id: string
          sort_order?: number
          user_id: string
        }
        Update: {
          created_at?: string
          hidden?: boolean
          id?: string
          list_id?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_subscriptions_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shared_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_lists: {
        Row: {
          cadence: string | null
          church_id: string | null
          created_at: string
          created_by: string
          description: string | null
          group_id: string | null
          id: string
          name: string
          public_page: boolean
          published_at: string | null
          scope: string
          status: string
          updated_at: string
          write_mode: string
        }
        Insert: {
          cadence?: string | null
          church_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          group_id?: string | null
          id?: string
          name: string
          public_page?: boolean
          published_at?: string | null
          scope: string
          status?: string
          updated_at?: string
          write_mode?: string
        }
        Update: {
          cadence?: string | null
          church_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          group_id?: string | null
          id?: string
          name?: string
          public_page?: boolean
          published_at?: string | null
          scope?: string
          status?: string
          updated_at?: string
          write_mode?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_lists_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_lists_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_requests: {
        Row: {
          answered_at: string | null
          body: string | null
          created_at: string
          id: string
          list_id: string
          moderated_by: string | null
          status: string
          submitted_by: string
          title: string
          updated_at: string
        }
        Insert: {
          answered_at?: string | null
          body?: string | null
          created_at?: string
          id?: string
          list_id: string
          moderated_by?: string | null
          status?: string
          submitted_by: string
          title: string
          updated_at?: string
        }
        Update: {
          answered_at?: string | null
          body?: string | null
          created_at?: string
          id?: string
          list_id?: string
          moderated_by?: string | null
          status?: string
          submitted_by?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_requests_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shared_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      flag_inactive_members: { Args: never; Returns: undefined }
      get_church_members_with_email: {
        Args: { target_church_id: string }
        Returns: {
          church_id: string
          deactivated_at: string
          deactivated_by: string
          email: string
          full_name: string
          id: string
          joined_at: string
          last_seen_at: string
          role: string
          status: string
          user_id: string
        }[]
      }
      get_shared_list_stats: {
        Args: { p_list_id: string }
        Returns: {
          active_requests: number
          answered_count: number
          subscriber_count: number
        }[]
      }
      get_user_entitlement: { Args: { target_user_id: string }; Returns: Json }
      is_list_moderator: { Args: { p_list_id: string }; Returns: boolean }
      publish_list: {
        Args: { p_list_id: string }
        Returns: {
          cadence: string | null
          church_id: string | null
          created_at: string
          created_by: string
          description: string | null
          group_id: string | null
          id: string
          name: string
          public_page: boolean
          published_at: string | null
          scope: string
          status: string
          updated_at: string
          write_mode: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
