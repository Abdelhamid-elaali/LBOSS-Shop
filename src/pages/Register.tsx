import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Mail, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    document.title = 'Executive Registration — LBOSS SHOP';
  }, []);

  const onSubmit = async (data: RegisterFormInputs) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser = {
      id: Math.floor(Math.random() * 1000) + 100,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: 'https://dummyjson.com/icon/emilys/128',
      accessToken: 'simulated_dummy_jwt_' + Date.now(),
      refreshToken: 'simulated_dummy_refresh_' + Date.now(),
    };

    dispatch(setCredentials(newUser));
    toast.success(`Clearance Initialized: Welcome ${data.firstName}!`, {
      style: { background: '#181b24', color: '#ffd88a', fontFamily: 'JetBrains Mono' },
    });
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-none bg-[#14171f] border border-white/10 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img
              src="/LBOSS-SHOP-logo-transparent-600.png"
              alt="LBOSS SHOP"
              className="h-12 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-['Sora'] font-black text-2xl sm:text-3xl text-[#e0e2ed]">
            Initiate Clearance
          </h1>
          <p className="font-['JetBrains_Mono'] text-xs text-[#9c8f78] mt-1">
            Establish your 2027 executive identity and private vault access
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                First Name
              </label>
              <Input
                {...register('firstName')}
                error={errors.firstName?.message}
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
                Last Name
              </label>
              <Input
                {...register('lastName')}
                error={errors.lastName?.message}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
              Terminal Email Address
            </label>
            <Input
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="jane@example.com"
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
              Terminal Username
            </label>
            <Input
              {...register('username')}
              error={errors.username?.message}
              placeholder="janedoe"
              icon={<User className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
              Cryptographic Password
            </label>
            <Input
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs font-bold text-[#d4c5ac] mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="primary"
            size="lg"
            className="w-full gap-2 font-black mt-2 shadow-[0_12px_32px_-8px_rgba(245,183,0,0.4)]"
          >
            <span>Generate Clearance</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
          <span>Already possess clearance? </span>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            className="font-bold text-[#ffd88a] hover:underline"
          >
            Authenticate session
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
