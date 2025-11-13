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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          ai_analysis: string | null
          ai_analysis_date: string | null
          ai_match_score: number | null
          candidate_email: string
          candidate_name: string
          candidate_phone: string | null
          cover_letter: string | null
          created_at: string
          cv_url: string | null
          id: string
          job_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          ai_analysis?: string | null
          ai_analysis_date?: string | null
          ai_match_score?: number | null
          candidate_email: string
          candidate_name: string
          candidate_phone?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          job_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          ai_analysis?: string | null
          ai_analysis_date?: string | null
          ai_match_score?: number | null
          candidate_email?: string
          candidate_name?: string
          candidate_phone?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          job_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      business_members: {
        Row: {
          business_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          business_id: string
          id?: string
          joined_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          business_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          brand_colors: Json | null
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          owner_id: string
          size: string | null
          updated_at: string | null
        }
        Insert: {
          brand_colors?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          owner_id: string
          size?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_colors?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          size?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      floor_plan_checks: {
        Row: {
          ai_suggestions: string | null
          check_type: string
          created_at: string | null
          floor_plan_id: string
          id: string
          issues_found: Json | null
          severity: string | null
        }
        Insert: {
          ai_suggestions?: string | null
          check_type: string
          created_at?: string | null
          floor_plan_id: string
          id?: string
          issues_found?: Json | null
          severity?: string | null
        }
        Update: {
          ai_suggestions?: string | null
          check_type?: string
          created_at?: string | null
          floor_plan_id?: string
          id?: string
          issues_found?: Json | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_checks_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plan_comments: {
        Row: {
          comment: string
          created_at: string | null
          floor_plan_id: string
          id: string
          position_x: number | null
          position_y: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          floor_plan_id: string
          id?: string
          position_x?: number | null
          position_y?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          floor_plan_id?: string
          id?: string
          position_x?: number | null
          position_y?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_comments_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plan_cost_estimates: {
        Row: {
          cost_breakdown: Json | null
          created_at: string | null
          floor_plan_id: string
          id: string
          labor_cost: number | null
          materials_cost: number | null
          total_cost: number | null
          updated_at: string | null
        }
        Insert: {
          cost_breakdown?: Json | null
          created_at?: string | null
          floor_plan_id: string
          id?: string
          labor_cost?: number | null
          materials_cost?: number | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          cost_breakdown?: Json | null
          created_at?: string | null
          floor_plan_id?: string
          id?: string
          labor_cost?: number | null
          materials_cost?: number | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_cost_estimates_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plan_exports: {
        Row: {
          created_at: string | null
          export_type: string
          file_url: string | null
          floor_plan_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          export_type: string
          file_url?: string | null
          floor_plan_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          export_type?: string
          file_url?: string | null
          floor_plan_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_exports_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plan_reviews: {
        Row: {
          comments: string | null
          created_at: string | null
          floor_plan_id: string
          id: string
          reviewer_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          floor_plan_id: string
          id?: string
          reviewer_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          floor_plan_id?: string
          id?: string
          reviewer_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_reviews_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plan_shares: {
        Row: {
          access_level: string | null
          created_at: string | null
          floor_plan_id: string
          id: string
          shared_by: string
          shared_with_email: string
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          floor_plan_id: string
          id?: string
          shared_by: string
          shared_with_email: string
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          floor_plan_id?: string
          id?: string
          shared_by?: string
          shared_with_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_shares_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plan_versions: {
        Row: {
          canvas_data: Json | null
          created_at: string | null
          file_url: string | null
          floor_plan_id: string
          id: string
          thumbnail_url: string | null
          version_number: number
        }
        Insert: {
          canvas_data?: Json | null
          created_at?: string | null
          file_url?: string | null
          floor_plan_id: string
          id?: string
          thumbnail_url?: string | null
          version_number: number
        }
        Update: {
          canvas_data?: Json | null
          created_at?: string | null
          file_url?: string | null
          floor_plan_id?: string
          id?: string
          thumbnail_url?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "floor_plan_versions_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      floor_plans: {
        Row: {
          area_sqm: number | null
          created_at: string | null
          description: string | null
          id: string
          project_type: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          area_sqm?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          project_type?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          area_sqm?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          project_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          ai_evaluation: string | null
          ai_recommendation: string | null
          ai_score: number | null
          ai_transcript: string | null
          application_id: string
          created_at: string
          id: string
          interview_date: string
          interview_type: string | null
          interviewer_name: string | null
          location: string | null
          meeting_link: string | null
          notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          ai_evaluation?: string | null
          ai_recommendation?: string | null
          ai_score?: number | null
          ai_transcript?: string | null
          application_id: string
          created_at?: string
          id?: string
          interview_date: string
          interview_type?: string | null
          interviewer_name?: string | null
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          ai_evaluation?: string | null
          ai_recommendation?: string | null
          ai_score?: number | null
          ai_transcript?: string | null
          application_id?: string
          created_at?: string
          id?: string
          interview_date?: string
          interview_type?: string | null
          interviewer_name?: string | null
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          email: string
          expected_salary: string | null
          full_name: string
          id: string
          job_id: string | null
          linkedin_url: string | null
          location: string | null
          phone: string
          portfolio_url: string | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          email: string
          expected_salary?: string | null
          full_name: string
          id?: string
          job_id?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone: string
          portfolio_url?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          expected_salary?: string | null
          full_name?: string
          id?: string
          job_id?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string
          portfolio_url?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          employment_type: string | null
          id: string
          location: string | null
          requirements: string | null
          salary_range: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_steps: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          skipped: boolean | null
          step_name: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          skipped?: boolean | null
          step_name: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          skipped?: boolean | null
          step_name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string | null
          business_id: string | null
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          login_method: string | null
          onboarding_completed: boolean | null
          preferences: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          account_type?: string | null
          business_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          login_method?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          account_type?: string | null
          business_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          login_method?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      role_specific_data: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      role_upgrade_requests: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          requested_role: Database["public"]["Enums"]["app_role"]
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          requested_role: Database["public"]["Enums"]["app_role"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          requested_role?: Database["public"]["Enums"]["app_role"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string
          device_info: Json | null
          id: string
          ip_address: string | null
          location_info: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          location_info?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          location_info?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_auth_methods: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          method: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          method: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          method?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          current_credits: number
          id: string
          last_refresh_date: string
          max_credits: number
          next_refresh_date: string
          total_credits_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_credits?: number
          id?: string
          last_refresh_date?: string
          max_credits?: number
          next_refresh_date?: string
          total_credits_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_credits?: number
          id?: string
          last_refresh_date?: string
          max_credits?: number
          next_refresh_date?: string
          total_credits_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feature_modules: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          enabled_at: string | null
          id: string
          module_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          enabled_at?: string | null
          id?: string
          module_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          enabled_at?: string | null
          id?: string
          module_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      add_credits: {
        Args: {
          p_amount: number
          p_description: string
          p_transaction_type?: string
          p_user_id: string
        }
        Returns: undefined
      }
      deduct_credits: {
        Args: { p_amount: number; p_description: string; p_user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_changes?: Json
          p_entity_id?: string
          p_entity_type: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: string
      }
      log_user_activity: {
        Args: { p_activity_type: string; p_metadata?: Json; p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "architect"
        | "reviewer"
        | "business_user"
        | "finance_manager"
        | "procurement_manager"
        | "sales_manager"
        | "executive"
        | "home_builder"
        | "employee"
        | "hr_manager"
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
    Enums: {
      app_role: [
        "admin",
        "architect",
        "reviewer",
        "business_user",
        "finance_manager",
        "procurement_manager",
        "sales_manager",
        "executive",
        "home_builder",
        "employee",
        "hr_manager",
      ],
    },
  },
} as const
