export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      experiment_runs: {
        Row: {
          created_at: string
          created_by: string
          id: string
          input_parameters: Json
          metrics: Json | null
          model_used: string
          output_images: Json | null
          output_text: string | null
          template_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          input_parameters?: Json
          metrics?: Json | null
          model_used: string
          output_images?: Json | null
          output_text?: string | null
          template_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          input_parameters?: Json
          metrics?: Json | null
          model_used?: string
          output_images?: Json | null
          output_text?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_runs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          model_config: Json
          name: string
          system_message: string
          updated_at: string
          user_message: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          model_config?: Json
          name: string
          system_message: string
          updated_at?: string
          user_message: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          model_config?: Json
          name?: string
          system_message?: string
          updated_at?: string
          user_message?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          art_style: string | null
          characters: string | null
          child_age: string | null
          child_name: string | null
          content: string
          created_at: string
          favorite_animal: string | null
          id: string
          magical_power: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          art_style?: string | null
          characters?: string | null
          child_age?: string | null
          child_name?: string | null
          content: string
          created_at?: string
          favorite_animal?: string | null
          id?: string
          magical_power?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          art_style?: string | null
          characters?: string | null
          child_age?: string | null
          child_name?: string | null
          content?: string
          created_at?: string
          favorite_animal?: string | null
          id?: string
          magical_power?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      story_pages: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          page_number: number
          story_id: string | null
          text_content: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          page_number: number
          story_id?: string | null
          text_content: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          page_number?: number
          story_id?: string | null
          text_content?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_pages_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          child_age: string | null
          child_name: string | null
          created_at: string
          favorite_animal: string | null
          favorite_characters: string | null
          id: string
          preferred_art_style: string | null
          preferred_magical_power: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          child_age?: string | null
          child_name?: string | null
          created_at?: string
          favorite_animal?: string | null
          favorite_characters?: string | null
          id?: string
          preferred_art_style?: string | null
          preferred_magical_power?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          child_age?: string | null
          child_name?: string | null
          created_at?: string
          favorite_animal?: string | null
          favorite_characters?: string | null
          id?: string
          preferred_art_style?: string | null
          preferred_magical_power?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
