import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useLoginMutation } from '../features/api/apiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [loginMutation, { isLoading }] = useLoginMutation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    document.title = 'VIP Authentication — LBOSS SHOP';
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await loginMutation({
        username: data.username,
        password: data.password,
        expiresInMins: 60,
      }).unwrap();

      dispatch(setCredentials(response));
      toast.success(`VIP Clearance Granted: Welcome ${response.firstName}!`, {
        style: { background: '#181b24', color: '#ffd88a', fontFamily: 'JetBrains Mono' },
      });
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      const msg = err?.data?.message || 'Authentication failed. Please verify credentials.';
      toast.error(msg);
    }
  };

  const fillDemoAccount = () => {
    setValue('username', 'emilys');
    setValue('password', 'emilyspass');
    toast.success('Executive demo credentials loaded!', {
      style: { background: '#181b24', color: '#ffd88a', fontFamily: 'JetBrains Mono' },
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-none bg-[#14171f] border border-white/10 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img
              src="/LBOSS-SHOP-logo-transparent-600.png"
              alt="LBOSS SHOP"
              className="h-12 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-['Sora'] font-black text-2xl sm:text-3xl text-[#e0e2ed]">
            VIP Terminal Access
          </h1>
          <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] mt-1">
            Authenticate to access your private vault, orders &amp; bespoke allocations
          </p>
        </div>

        {/* Demo credentials hint pill */}
        <div className="mb-6 p-4 rounded-2xl bg-[#0b0e16] border border-white/5 font-['JetBrains_Mono'] text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-[#ffd88a] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f5b700]" />
              Executive Demo Token
            </span>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-[11px] font-bold text-[#ffd88a] hover:underline cursor-pointer"
            >
              Autofill Credentials
            </button>
          </div>
          <p className="text-[#9c8f78] text-[11px]">
            User: <strong className="text-[#e0e2ed]">emilys</strong> • Key: <strong className="text-[#e0e2ed]">emilyspass</strong>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
              Terminal Identifier
            </label>
            <Input
              {...register('username')}
              error={errors.username?.message}
              placeholder="e.g. emilys"
              icon={<User className="w-4 h-4" />}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac]">
                Cryptographic Key
              </label>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#ffd88a] cursor-pointer hover:underline">
                Reset Key?
              </span>
            </div>
            <Input
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            variant="primary"
            size="lg"
            className="w-full gap-2 font-black mt-2 shadow-[0_12px_32px_-8px_rgba(245,183,0,0.4)]"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            onClick={fillDemoAccount}
            variant="secondary"
            size="md"
            className="w-full gap-2 mt-1"
          >
            <Sparkles className="w-4 h-4 text-[#f5b700]" />
            <span>Use Demo Executive Token (1-Click)</span>
          </Button>
        </form>

        {/* Register link */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
          <span>New to 2027 collection? </span>
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
            className="font-bold text-[#ffd88a] hover:underline"
          >
            Initiate Clearance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
