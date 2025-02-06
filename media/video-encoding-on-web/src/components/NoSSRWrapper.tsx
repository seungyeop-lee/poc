import dynamic from 'next/dynamic';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

const NoSSRWrapper = (props: Props) => <>{props.children}</>;
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
