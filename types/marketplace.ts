export interface MarketplaceItem {
  name: string;
  description: string;
  url: string;
  affiliate: boolean;
  image: string;
  category: string;
  tags: string[];
}

export interface MarketplaceItemWithId extends MarketplaceItem {
  id: string;
}
