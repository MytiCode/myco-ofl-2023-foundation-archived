import shallNotPassImage from '../../public/shall-not-pass.png';
import Image from 'next/image';

export function Login({ onLogin, error }: { onLogin: (token: string) => void, error?: string }) {
  return (
    <form
      className="p-2 pt-6 w-1/2 mx-auto flex flex-col "
      onSubmit={e => {
        e.preventDefault();

        const token = e.currentTarget.token.value;
        if (token) {
          onLogin(token);
        } else {
          // TODO(benglass): its required dude
          // There is only one field, not worth investing in validation
          console.log('naw dude, its required');
        }
      }}
    >
      <Image src={shallNotPassImage} alt="YOU SHALL NOT PASS" className="mb-4 rounded-lg" />
      <label className="text-4xl mb-6 block text-center font-bold text-white -mt-16" htmlFor="token">
        YOU SHALL NOT PASS!
      </label>
      {error &&
        <p className="text-xl text-red-700 mb-2 font-bold">Invalid token, please try again (copy/paste error?) or ask for a fresh one, this one my be expired.</p>
      }
      <input id="token" aria-label="Token" placeholder="What is the secret password?" name="token" className="border-slate-200 border-2 w-full p-4 mb-2 text-2xl rounded-md" type="password" />
      <button type="submit" className="bg-teal-800 hover:bg-teal-700 text-lg text-white font-bold py-2 px-6 border rounded-md">Login</button>
    </form>
  );
}
