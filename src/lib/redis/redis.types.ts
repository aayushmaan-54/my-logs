export type postEmailStatus =
  | 'pending'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'cancelled';

export interface postEmailMeta {
  postId: string;
  filePath: string;
  collection: 'blogs' | 'short_reads';
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  emailStatus: postEmailStatus;
  scheduledAt?: string;
  jobId?: string;
}
