import { useEffect } from 'react';

export const TitleRender = (title) => {
 useEffect(() => {
    document.title = title;
  }, [title]);
}

