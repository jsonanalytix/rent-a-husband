export { taskService } from './taskService';
export { messagingService } from './messagingService';

// Re-export types
export type { TaskWithDetails, TaskSearchParams, TaskSearchResult } from './taskService';
export type { Conversation, MessageWithSender } from './messagingService'; 