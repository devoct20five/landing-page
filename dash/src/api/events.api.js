import { http } from "./http";

/** @param {{eventType?, status?, clientId?, projectId?, attendeeUserId?, from?, to?, page?, limit?}} params */
export const listEvents = (params) => http.list("/events", params);

export const getEvent = (id) => http.get(`/events/${id}`);
export const createEvent = (payload) => http.post("/events", payload);
export const updateEvent = (id, payload) => http.patch(`/events/${id}`, payload);
export const deleteEvent = (id) => http.delete(`/events/${id}`);

export const addAttendees = (id, payload) =>
  http.post(`/events/${id}/attendees`, payload);
export const removeAttendee = (id, userId) =>
  http.delete(`/events/${id}/attendees/${userId}`);

/** @param {{status: 'invited'|'accepted'|'declined'}} payload */
export const rsvp = (id, payload) => http.patch(`/events/${id}/rsvp`, payload);
