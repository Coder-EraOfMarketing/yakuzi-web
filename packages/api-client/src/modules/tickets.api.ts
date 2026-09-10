import { z } from 'zod';
import { api } from '../api';

// ─── Schemas ────────────────────────────────────────

export const TicketMessageSchema = z.object({
  id: z.string(),
  message: z.string(),
  sender: z.enum(['user', 'admin']),
  createdAt: z.string(),
});

export const TicketSchema = z.object({
  id: z.string(),
  subject: z.string(),
  description: z.string(),
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  category: z.string().optional(),
  messages: z.array(TicketMessageSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const TicketListResponseSchema = z.object({
  data: z.array(TicketSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const CreateTicketSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

// ─── Types ──────────────────────────────────────────

export type TicketMessage = z.infer<typeof TicketMessageSchema>;
export type Ticket = z.infer<typeof TicketSchema>;
export type TicketListResponse = z.infer<typeof TicketListResponseSchema>;
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

// ─── API Functions ──────────────────────────────────

function normalizeTicket(ticket: any) {
  if (!ticket || typeof ticket !== 'object') return ticket;
  if (!ticket.id && ticket._id) ticket.id = ticket._id;
  if (!ticket.description && ticket.message) ticket.description = ticket.message;
  if (!ticket.messages) ticket.messages = [];
  return ticket;
}

function normalizeTicketListResponse(response: any): TicketListResponse {
  const raw = response?.data ?? response;
  const tickets = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.tickets)
    ? raw.tickets
    : Array.isArray(response?.data)
    ? response.data
    : [];

  const normalizedTickets = tickets.map(normalizeTicket);

  return {
    data: normalizedTickets,
    total: raw?.total ?? normalizedTickets.length,
    page: raw?.page ?? 1,
    limit: raw?.limit ?? normalizedTickets.length,
  };
}

/**
 * Every call here used to try `/buyers/tickets` first, take the 404, and then
 * call `/tickets` — the route that has always existed. Two round trips for
 * every ticket read and write, and a 404 in the console each time.
 *
 * The API's ticket routes are, and only are:
 *   GET  /tickets            POST /tickets
 *   GET  /tickets/:id        POST /tickets/:id/messages
 */

/** Unwrap whichever envelope the endpoint used. */
const unwrapTicket = (data: any) =>
  normalizeTicket(data?.data?.ticket ?? data?.ticket ?? data?.data ?? data);

export async function getTickets(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<TicketListResponse> {
  const { data } = await api.get('/tickets', { params });
  return normalizeTicketListResponse(data);
}

export async function getTicketById(id: string): Promise<Ticket> {
  const { data } = await api.get(`/tickets/${id}`);
  return unwrapTicket(data);
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const { data } = await api.post('/tickets', input);
  return unwrapTicket(data);
}

export async function addTicketMessage(ticketId: string, message: string): Promise<TicketMessage> {
  const { data } = await api.post(`/tickets/${ticketId}/messages`, { message });
  return unwrapTicket(data);
}

/**
 * NOTE: there is no close route on the API — not at this path and not at
 * `/buyers/tickets/:id/close` either, so the old fallback only turned one 404
 * into two. The "Close ticket" button in SupportDrawer calls this and has
 * therefore never worked. Left pointing at the path it would live on, rather
 * than deleted, because the button is real and the endpoint is the missing
 * half. Adding `PATCH /tickets/:id/close` on the API makes it work as-is.
 */
export async function closeTicket(ticketId: string): Promise<Ticket> {
  const { data } = await api.patch(`/tickets/${ticketId}/close`);
  return unwrapTicket(data);
}
