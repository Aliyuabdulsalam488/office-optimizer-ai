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
      approvals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          rejection_reason: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          rejection_reason?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          rejection_reason?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
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
      budget_items: {
        Row: {
          allocated_amount: number
          budget_id: string | null
          category: string
          created_at: string | null
          id: string
          spent_amount: number | null
        }
        Insert: {
          allocated_amount: number
          budget_id?: string | null
          category: string
          created_at?: string | null
          id?: string
          spent_amount?: number | null
        }
        Update: {
          allocated_amount?: number
          budget_id?: string | null
          category?: string
          created_at?: string | null
          id?: string
          spent_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          actual_spend: number | null
          committed_spend: number | null
          created_at: string | null
          created_by: string | null
          department: string
          fiscal_year: number
          id: string
          total_budget: number
          updated_at: string | null
        }
        Insert: {
          actual_spend?: number | null
          committed_spend?: number | null
          created_at?: string | null
          created_by?: string | null
          department: string
          fiscal_year: number
          id?: string
          total_budget: number
          updated_at?: string | null
        }
        Update: {
          actual_spend?: number | null
          committed_spend?: number | null
          created_at?: string | null
          created_by?: string | null
          department?: string
          fiscal_year?: number
          id?: string
          total_budget?: number
          updated_at?: string | null
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
      chart_of_accounts: {
        Row: {
          account_code: string
          account_name: string
          account_type: string
          created_at: string | null
          currency: string
          id: string
          opening_balance: number | null
          parent_account_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_code: string
          account_name: string
          account_type: string
          created_at?: string | null
          currency?: string
          id?: string
          opening_balance?: number | null
          parent_account_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_code?: string
          account_name?: string
          account_type?: string
          created_at?: string | null
          currency?: string
          id?: string
          opening_balance?: number | null
          parent_account_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      currency_rates: {
        Row: {
          created_at: string | null
          effective_date: string
          from_currency: string
          id: string
          rate: number
          to_currency: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          effective_date?: string
          from_currency: string
          id?: string
          rate: number
          to_currency: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          effective_date?: string
          from_currency?: string
          id?: string
          rate?: number
          to_currency?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          customer_id: string
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          proof_url: string | null
          reference: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          customer_id: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method: string
          payment_number: string
          proof_url?: string | null
          reference?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          customer_id?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          proof_url?: string | null
          reference?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          company_name: string | null
          country: string
          created_at: string | null
          currency: string
          customer_type: string
          display_name: string | null
          email: string | null
          id: string
          name: string
          opening_balance: number | null
          payment_terms: number | null
          phone: string | null
          portal_enabled: boolean | null
          status: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          country?: string
          created_at?: string | null
          currency?: string
          customer_type: string
          display_name?: string | null
          email?: string | null
          id?: string
          name: string
          opening_balance?: number | null
          payment_terms?: number | null
          phone?: string | null
          portal_enabled?: boolean | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string | null
          country?: string
          created_at?: string | null
          currency?: string
          customer_type?: string
          display_name?: string | null
          email?: string | null
          id?: string
          name?: string
          opening_balance?: number | null
          payment_terms?: number | null
          phone?: string | null
          portal_enabled?: boolean | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      finance_audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
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
      goods_received_notes: {
        Row: {
          created_at: string | null
          grn_number: string
          id: string
          notes: string | null
          po_id: string | null
          received_by: string | null
          received_date: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          grn_number: string
          id?: string
          notes?: string | null
          po_id?: string | null
          received_by?: string | null
          received_date?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          grn_number?: string
          id?: string
          notes?: string | null
          po_id?: string | null
          received_by?: string | null
          received_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goods_received_notes_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      grn_items: {
        Row: {
          created_at: string | null
          grn_id: string | null
          id: string
          inspector_name: string | null
          po_item_id: string | null
          qa_notes: string | null
          qa_status: string | null
          received_quantity: number
        }
        Insert: {
          created_at?: string | null
          grn_id?: string | null
          id?: string
          inspector_name?: string | null
          po_item_id?: string | null
          qa_notes?: string | null
          qa_status?: string | null
          received_quantity: number
        }
        Update: {
          created_at?: string | null
          grn_id?: string | null
          id?: string
          inspector_name?: string | null
          po_item_id?: string | null
          qa_notes?: string | null
          qa_status?: string | null
          received_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "grn_items_grn_id_fkey"
            columns: ["grn_id"]
            isOneToOne: false
            referencedRelation: "goods_received_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_items_po_item_id_fkey"
            columns: ["po_item_id"]
            isOneToOne: false
            referencedRelation: "po_items"
            referencedColumns: ["id"]
          },
        ]
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
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string
          item_id: string | null
          quantity: number
          tax_amount: number | null
          tax_enabled: boolean | null
          tax_rate: number | null
          total: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id: string
          item_id?: string | null
          quantity?: number
          tax_amount?: number | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          total?: number | null
          unit_price?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
          item_id?: string | null
          quantity?: number
          tax_amount?: number | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          total?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          attachments: Json | null
          balance: number | null
          created_at: string | null
          currency: string
          customer_id: string
          discount: number | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          invoice_type: string
          notes: string | null
          other_charges: number | null
          paid_amount: number | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          terms: string | null
          total: number | null
          transport_fee: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          balance?: number | null
          created_at?: string | null
          currency?: string
          customer_id: string
          discount?: number | null
          due_date: string
          id?: string
          invoice_date?: string
          invoice_number: string
          invoice_type: string
          notes?: string | null
          other_charges?: number | null
          paid_amount?: number | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          terms?: string | null
          total?: number | null
          transport_fee?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          balance?: number | null
          created_at?: string | null
          currency?: string
          customer_id?: string
          discount?: number | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          invoice_type?: string
          notes?: string | null
          other_charges?: number | null
          paid_amount?: number | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          terms?: string | null
          total?: number | null
          transport_fee?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          category: string | null
          cost_price: number | null
          created_at: string | null
          currency: string
          current_stock: number | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          opening_stock: number | null
          reorder_level: number | null
          sku: string | null
          status: string | null
          tax_enabled: boolean | null
          tax_rate: number | null
          unit_price: number
          updated_at: string | null
          user_id: string
          warehouse: string | null
        }
        Insert: {
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          currency?: string
          current_stock?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          opening_stock?: number | null
          reorder_level?: number | null
          sku?: string | null
          status?: string | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          unit_price?: number
          updated_at?: string | null
          user_id: string
          warehouse?: string | null
        }
        Update: {
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          currency?: string
          current_stock?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          opening_stock?: number | null
          reorder_level?: number | null
          sku?: string | null
          status?: string | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          unit_price?: number
          updated_at?: string | null
          user_id?: string
          warehouse?: string | null
        }
        Relationships: []
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
      ledger_entries: {
        Row: {
          account_id: string
          created_at: string | null
          created_by: string
          credit: number | null
          currency: string
          debit: number | null
          description: string | null
          entry_date: string
          id: string
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          created_by: string
          credit?: number | null
          currency?: string
          debit?: number | null
          description?: string | null
          entry_date?: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          created_by?: string
          credit?: number | null
          currency?: string
          debit?: number | null
          description?: string | null
          entry_date?: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      organizations: {
        Row: {
          address: string | null
          country: string
          created_at: string | null
          currency: string
          display_name: string | null
          email: string | null
          id: string
          language: string | null
          logo_url: string | null
          name: string
          phone: string | null
          tax_enabled: boolean | null
          tax_rate: number | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          country?: string
          created_at?: string | null
          currency?: string
          display_name?: string | null
          email?: string | null
          id?: string
          language?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          country?: string
          created_at?: string | null
          currency?: string
          display_name?: string | null
          email?: string | null
          id?: string
          language?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          bank_reference: string | null
          created_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          paid_by: string | null
          payment_date: string
          payment_method: string | null
          payment_number: string
          vendor_id: string | null
        }
        Insert: {
          amount: number
          bank_reference?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          paid_by?: string | null
          payment_date: string
          payment_method?: string | null
          payment_number: string
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          paid_by?: string | null
          payment_date?: string
          payment_method?: string | null
          payment_number?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      po_items: {
        Row: {
          created_at: string | null
          id: string
          item_description: string
          po_id: string | null
          quantity: number
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_description: string
          po_id?: string | null
          quantity: number
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_description?: string
          po_id?: string | null
          quantity?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "po_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      po_items_finance: {
        Row: {
          created_at: string | null
          description: string
          id: string
          item_id: string | null
          po_id: string
          quantity: number
          received_quantity: number | null
          tax_amount: number | null
          tax_enabled: boolean | null
          tax_rate: number | null
          total: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          item_id?: string | null
          po_id: string
          quantity?: number
          received_quantity?: number | null
          tax_amount?: number | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          total?: number | null
          unit_price?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          item_id?: string | null
          po_id?: string
          quantity?: number
          received_quantity?: number | null
          tax_amount?: number | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          total?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "po_items_finance_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_items_finance_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders_finance"
            referencedColumns: ["id"]
          },
        ]
      }
      pr_items: {
        Row: {
          created_at: string | null
          estimated_total: number | null
          estimated_unit_price: number | null
          id: string
          item_description: string
          pr_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          estimated_total?: number | null
          estimated_unit_price?: number | null
          id?: string
          item_description: string
          pr_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string | null
          estimated_total?: number | null
          estimated_unit_price?: number | null
          id?: string
          item_description?: string
          pr_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "pr_items_pr_id_fkey"
            columns: ["pr_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
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
      purchase_orders: {
        Row: {
          approved_by: string | null
          created_at: string | null
          created_by: string | null
          delivery_date: string | null
          discount: number | null
          id: string
          notes: string | null
          po_date: string | null
          po_number: string
          pr_id: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          terms_conditions: string | null
          total: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_date?: string | null
          discount?: number | null
          id?: string
          notes?: string | null
          po_date?: string | null
          po_number: string
          pr_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          terms_conditions?: string | null
          total?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_date?: string | null
          discount?: number | null
          id?: string
          notes?: string | null
          po_date?: string | null
          po_number?: string
          pr_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          terms_conditions?: string | null
          total?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_pr_id_fkey"
            columns: ["pr_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders_finance: {
        Row: {
          created_at: string | null
          currency: string
          expected_date: string | null
          id: string
          notes: string | null
          po_date: string
          po_number: string
          status: string | null
          subtotal: number | null
          supplier_id: string
          tax_amount: number | null
          total: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          expected_date?: string | null
          id?: string
          notes?: string | null
          po_date?: string
          po_number: string
          status?: string | null
          subtotal?: number | null
          supplier_id: string
          tax_amount?: number | null
          total?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          expected_date?: string | null
          id?: string
          notes?: string | null
          po_date?: string
          po_number?: string
          status?: string | null
          subtotal?: number | null
          supplier_id?: string
          tax_amount?: number | null
          total?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_finance_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requests: {
        Row: {
          created_at: string | null
          department: string
          description: string | null
          id: string
          justification: string | null
          pr_number: string
          requested_by: string | null
          requested_date: string | null
          reviewed_by: string | null
          reviewed_date: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          description?: string | null
          id?: string
          justification?: string | null
          pr_number: string
          requested_by?: string | null
          requested_date?: string | null
          reviewed_by?: string | null
          reviewed_date?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          description?: string | null
          id?: string
          justification?: string | null
          pr_number?: string
          requested_by?: string | null
          requested_date?: string | null
          reviewed_by?: string | null
          reviewed_date?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
      stock_movements: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          item_id: string
          movement_type: string
          notes: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          item_id: string
          movement_type: string
          notes?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          item_id?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_invoices: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          po_id: string | null
          status: string | null
          tax: number | null
          total: number
          updated_at: string | null
          uploaded_file_url: string | null
          validated_by: string | null
          validated_date: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_date: string
          invoice_number: string
          notes?: string | null
          po_id?: string | null
          status?: string | null
          tax?: number | null
          total: number
          updated_at?: string | null
          uploaded_file_url?: string | null
          validated_by?: string | null
          validated_date?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          po_id?: string | null
          status?: string | null
          tax?: number | null
          total?: number
          updated_at?: string | null
          uploaded_file_url?: string | null
          validated_by?: string | null
          validated_date?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_invoices_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          company_name: string | null
          country: string
          created_at: string | null
          currency: string
          email: string | null
          id: string
          name: string
          opening_balance: number | null
          payment_terms: number | null
          phone: string | null
          status: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          country?: string
          created_at?: string | null
          currency?: string
          email?: string | null
          id?: string
          name: string
          opening_balance?: number | null
          payment_terms?: number | null
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string | null
          country?: string
          created_at?: string | null
          currency?: string
          email?: string | null
          id?: string
          name?: string
          opening_balance?: number | null
          payment_terms?: number | null
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
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
      vendor_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          uploaded_by: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_attachments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          bank_details: Json | null
          category: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          performance_rating: number | null
          phone: string | null
          status: string | null
          tin: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bank_details?: Json | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          performance_rating?: number | null
          phone?: string | null
          status?: string | null
          tin?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bank_details?: Json | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          performance_rating?: number | null
          phone?: string | null
          status?: string | null
          tin?: string | null
          updated_at?: string | null
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
