import { z } from "zod";

export const createDeckSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
});

export const updateDeckSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const createCardSchema = z.object({
  deckId: z.number(),
  front: z.string().min(1, "Front text is required"),
  back: z.string().min(1, "Back text is required"),
  hint: z.string().optional(),
  order: z.number(),
});

export const updateCardSchema = z.object({
  front: z.string().min(1, "Front text is required").optional(),
  back: z.string().min(1, "Back text is required").optional(),
  hint: z.string().optional(),
  order: z.number().optional(),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;