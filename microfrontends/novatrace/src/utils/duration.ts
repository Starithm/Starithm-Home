export const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInHours > 24*365) {
      return `${Math.floor(diffInHours/(24*365))}y ago`;
    } else if (diffInHours > 24) {
      return `${Math.floor(diffInHours/24)}d ago`;
    }
    else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes}m ago`;
    } else {
      return '< 1h ago';
    }
  };