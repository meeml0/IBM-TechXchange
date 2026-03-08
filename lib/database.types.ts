export type Database = {
    public: {
      Tables: {
        hero_slides: {
          Row: {
            id: number;
            locale: string;
            title: string;
            subtitle: string | null;
            description: string;
            button_text: string;
            button_link: string;
            secondary_button_text: string | null;
            secondary_button_link: string | null;
            image_url: string;
            is_active: boolean;
            sort_order: number;
            created_at: string;
            updated_at: string;
          };
        };
      };
    };
  };