import { Api } from '../lib/api/api';
import { logic } from '@/lib/logic/logic';

export default async function Home() {
  const api = new Api();
  const apiResult = await api.get('/test');
  const logicResult = logic();

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h1 className="text-2xl">API Test Result</h1>
      <div className="p-4 bg-gray-100 rounded">
        {apiResult.data}
      </div>
      <h1 className="text-2xl">Logic Test Result</h1>
      <div className="p-4 bg-gray-100 rounded">
        {logicResult}
      </div>
    </div>
  );
}
