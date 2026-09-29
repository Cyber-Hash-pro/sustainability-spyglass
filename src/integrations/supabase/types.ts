export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_categories: {
        Row: {
          code: string
          default_unit: string
          description: string | null
          ghg_category: string | null
          id: string
          name: string
          scope: Database["public"]["Enums"]["emission_scope"]
        }
        Insert: {
          code: string
          default_unit: string
          description?: string | null
          ghg_category?: string | null
          id?: string
          name: string
          scope: Database["public"]["Enums"]["emission_scope"]
        }
        Update: {
          code?: string
          default_unit?: string
          description?: string | null
          ghg_category?: string | null
          id?: string
          name?: string
          scope?: Database["public"]["Enums"]["emission_scope"]
        }
        Relationships: []
      }
      activity_records: {
        Row: {
          activity_date: string
          approved_by: string | null
          category_id: string
          created_at: string
          department_id: string | null
          facility_id: string | null
          id: string
          notes: string | null
          organization_id: string
          quantity: number
          reporting_period_id: string | null
          status: Database["public"]["Enums"]["record_status"]
          submitted_by: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          activity_date: string
          approved_by?: string | null
          category_id: string
          created_at?: string
          department_id?: string | null
          facility_id?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          quantity: number
          reporting_period_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_by?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          activity_date?: string
          approved_by?: string | null
          category_id?: string
          created_at?: string
          department_id?: string | null
          facility_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          quantity?: number
          reporting_period_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_by?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_records_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "activity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_records_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_records_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_records_reporting_period_id_fkey"
            columns: ["reporting_period_id"]
            isOneToOne: false
            referencedRelation: "reporting_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          organization_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          organization_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          cost_center: string | null
          created_at: string
          facility_id: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          cost_center?: string | null
          created_at?: string
          facility_id?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          cost_center?: string | null
          created_at?: string
          facility_id?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      emission_calculations: {
        Row: {
          activity_record_id: string
          calculated_at: string
          co2e_kg: number
          emission_factor_version_id: string
          engine_version: string
          formula: string
          id: string
          normalized_quantity: number
          organization_id: string
          scope: Database["public"]["Enums"]["emission_scope"]
        }
        Insert: {
          activity_record_id: string
          calculated_at?: string
          co2e_kg: number
          emission_factor_version_id: string
          engine_version?: string
          formula: string
          id?: string
          normalized_quantity: number
          organization_id: string
          scope: Database["public"]["Enums"]["emission_scope"]
        }
        Update: {
          activity_record_id?: string
          calculated_at?: string
          co2e_kg?: number
          emission_factor_version_id?: string
          engine_version?: string
          formula?: string
          id?: string
          normalized_quantity?: number
          organization_id?: string
          scope?: Database["public"]["Enums"]["emission_scope"]
        }
        Relationships: [
          {
            foreignKeyName: "emission_calculations_activity_record_id_fkey"
            columns: ["activity_record_id"]
            isOneToOne: false
            referencedRelation: "activity_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emission_calculations_emission_factor_version_id_fkey"
            columns: ["emission_factor_version_id"]
            isOneToOne: false
            referencedRelation: "emission_factor_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emission_calculations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      emission_factor_versions: {
        Row: {
          co2e_unit: string
          created_at: string
          emission_factor_id: string
          id: string
          source: string
          source_year: number | null
          unit: string
          valid_from: string
          valid_to: string | null
          value: number
          version: number
        }
        Insert: {
          co2e_unit?: string
          created_at?: string
          emission_factor_id: string
          id?: string
          source: string
          source_year?: number | null
          unit: string
          valid_from: string
          valid_to?: string | null
          value: number
          version?: number
        }
        Update: {
          co2e_unit?: string
          created_at?: string
          emission_factor_id?: string
          id?: string
          source?: string
          source_year?: number | null
          unit?: string
          valid_from?: string
          valid_to?: string | null
          value?: number
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "emission_factor_versions_emission_factor_id_fkey"
            columns: ["emission_factor_id"]
            isOneToOne: false
            referencedRelation: "emission_factors"
            referencedColumns: ["id"]
          },
        ]
      }
      emission_factors: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
          organization_id: string | null
          region: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
          organization_id?: string | null
          region?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string | null
          region?: string
        }
        Relationships: [
          {
            foreignKeyName: "emission_factors_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "activity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emission_factors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          city: string | null
          code: string | null
          country: string | null
          created_at: string
          facility_type: string
          floor_area_m2: number | null
          headcount: number | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          ownership_share: number
          updated_at: string
          within_boundary: boolean
        }
        Insert: {
          city?: string | null
          code?: string | null
          country?: string | null
          created_at?: string
          facility_type?: string
          floor_area_m2?: number | null
          headcount?: number | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          ownership_share?: number
          updated_at?: string
          within_boundary?: boolean
        }
        Update: {
          city?: string | null
          code?: string | null
          country?: string | null
          created_at?: string
          facility_type?: string
          floor_area_m2?: number | null
          headcount?: number | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          ownership_share?: number
          updated_at?: string
          within_boundary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "facilities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          base_currency: string
          country: string | null
          created_at: string
          created_by: string | null
          fiscal_year_start_month: number
          id: string
          industry: string | null
          name: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          base_currency?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          fiscal_year_start_month?: number
          id?: string
          industry?: string | null
          name: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          base_currency?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          fiscal_year_start_month?: number
          id?: string
          industry?: string | null
          name?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reporting_periods: {
        Row: {
          consolidation_approach: string
          created_at: string
          end_date: string
          id: string
          is_baseline: boolean
          name: string
          organization_id: string
          start_date: string
          status: Database["public"]["Enums"]["period_status"]
        }
        Insert: {
          consolidation_approach?: string
          created_at?: string
          end_date: string
          id?: string
          is_baseline?: boolean
          name: string
          organization_id: string
          start_date: string
          status?: Database["public"]["Enums"]["period_status"]
        }
        Update: {
          consolidation_approach?: string
          created_at?: string
          end_date?: string
          id?: string
          is_baseline?: boolean
          name?: string
          organization_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["period_status"]
        }
        Relationships: [
          {
            foreignKeyName: "reporting_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization: {
        Args: { _country: string; _industry: string; _name: string }
        Returns: string
      }
      has_org_role: {
        Args: {
          _org: string
          _roles: Database["public"]["Enums"]["org_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin"
      emission_scope: "scope_1" | "scope_2" | "scope_3"
      org_role: "org_admin" | "esg_manager" | "data_contributor" | "auditor"
      period_status: "open" | "locked" | "closed"
      record_status: "draft" | "submitted" | "approved" | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin"],
      emission_scope: ["scope_1", "scope_2", "scope_3"],
      org_role: ["org_admin", "esg_manager", "data_contributor", "auditor"],
      period_status: ["open", "locked", "closed"],
      record_status: ["draft", "submitted", "approved", "rejected"],
    },
  },
} as const
