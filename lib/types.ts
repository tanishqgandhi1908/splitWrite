export interface Participant {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  /** Unit price in dollars, limited to 2 decimals. */
  price: number;
  /** Ids of participants splitting this item. */
  participantIds: string[];
}

export interface Bill {
  id: string;
  name: string;
  createdAt: number;
  participants: Participant[];
  items: Item[];
  /** Total tax in dollars (split equally across participants). */
  tax: number;
  /** Total discount in dollars (split equally across participants). */
  discount: number;
}
