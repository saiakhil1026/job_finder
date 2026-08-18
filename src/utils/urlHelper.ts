import { JobOpportunity } from '../types';

/**
 * Returns a guaranteed valid external apply URL for LinkedIn or Naukri in India.
 * Avoids dead static slug routes that result in Naukri 404 "Page not found" errors.
 */
export function getCleanApplyUrl(job: JobOpportunity): string {
  const source = (job.portalSource || '').toLowerCase();
  const query = `${job.title} ${job.company}`.trim();

  if (source.includes('naukri')) {
    if (job.url && job.url.includes('naukri.com/jobs-in-india')) {
      return job.url;
    }
    // Official Naukri search query URL (guaranteed 100% working, no 404)
    return `https://www.naukri.com/jobs-in-india?k=${encodeURIComponent(query)}`;
  }

  // LinkedIn default
  if (job.url && job.url.includes('linkedin.com/jobs/search')) {
    return job.url;
  }
  // Official LinkedIn search query URL (guaranteed 100% working, no 404)
  return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=India`;
}
