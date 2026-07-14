// "use client";

// import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
// import { signIn } from "next-auth/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FormEvent, useState } from "react";

// import { RegisterUser } from "@/app/actions/auth/registerUser";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { ImagePlus } from "lucide-react";

// export default function RegisterPage() {
//   const router = useRouter();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [image, setImage] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [uploadingImage, setUploadingImage] = useState(false);

//   const uploadImageToCloudinary = async (file: File) => {
//     const formData = new FormData();

//     formData.append("file", file);
//     formData.append(
//       "upload_preset",
//       process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
//     );

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       },
//     );

//     if (!response.ok) {
//       throw new Error("Image upload failed.");
//     }

//     return response.json();
//   };

//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     setError(null);

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     setLoading(true);

//     try {
//       let uploadedImage = "";

//       if (image) {
//         setUploadingImage(true);

//         const result = await uploadImageToCloudinary(image);

//         uploadedImage = result.secure_url;

//         setImageUrl(uploadedImage);

//         setUploadingImage(false);
//       }

//       await RegisterUser({
//         name,
//         email,
//         password,
//         confirmPassword,
//         image: uploadedImage,
//       });

//       // router.push("/login");
//       setSuccess("🎉 Account created successfully! You can now login.");

//       // Clear the form
//       setName("");
//       setEmail("");
//       setPassword("");
//       setConfirmPassword("");
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("Something went wrong.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
//       <Card className="w-full max-w-md border shadow-xl">
//         <CardContent className="p-8">
//           {/* Heading */}
//           <div className="mb-8 text-center">
//             <h1 className="text-3xl font-bold text-slate-900">
//               Create Account
//             </h1>

//             <p className="mt-2 text-sm text-slate-500">
//               Join MultiMart and start shopping today.
//             </p>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {/* Register Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Full Name
//               </label>

//               <div className="relative">
//                 <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

//                 <Input
//                   type="text"
//                   name="name"
//                   placeholder="John Doe"
//                   className="h-12 pl-10"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Email Address
//               </label>

//               <div className="relative">
//                 <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

//                 <Input
//                   type="email"
//                   name="email"
//                   placeholder="john@example.com"
//                   className="h-12 pl-10"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Profile Image */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Profile Image
//               </label>

//               <div className="space-y-3">
//                 <div className="relative">
//                   <ImagePlus className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

//                   <Input
//                     type="file"
//                     accept="image/*"
//                     className="h-12 pl-10"
//                     onChange={(e) => {
//                       if (e.target.files?.[0]) {
//                         setImage(e.target.files[0]);
//                       }
//                     }}
//                   />
//                 </div>

//                 {imageUrl && (
//                   <img
//                     src={imageUrl}
//                     alt="Profile"
//                     className="h-20 w-20 rounded-full object-cover border"
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">Password</label>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter password"
//                   className="h-12 pl-10 pr-10"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Confirm Password
//               </label>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

//                 <Input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   placeholder="Confirm password"
//                   className="h-12 pl-10 pr-10"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword((prev) => !prev)}
//                   className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             {/* <Button
//               type="submit"
//               disabled={loading}
//               className="h-12 w-full"
//             >
//               {loading ? "Creating Account..." : "Create Account"}
//             </Button> */}
//             <Button
//               type="submit"
//               disabled={loading || uploadingImage}
//               className="h-12 w-full"
//             >
//               {uploadingImage
//                 ? "Uploading Image..."
//                 : loading
//                   ? "Creating Account..."
//                   : "Create Account"}
//             </Button>
//           </form>

//           {/* Divider */}
//           <div className="my-6 flex items-center gap-3">
//             <div className="h-px flex-1 bg-slate-200" />
//             <span className="text-sm text-slate-400">OR</span>
//             <div className="h-px flex-1 bg-slate-200" />
//           </div>

//           {/* Google Login */}
//           <Button
//             type="button"
//             variant="outline"
//             className="h-12 w-full gap-3"
//             onClick={() => signIn("google", { callbackUrl: "/" })}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 48 48"
//               className="h-5 w-5"
//             >
//               <path
//                 fill="#FFC107"
//                 d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.5z"
//               />
//               <path
//                 fill="#FF3D00"
//                 d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
//               />
//               <path
//                 fill="#4CAF50"
//                 d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.3 44 24 44z"
//               />
//               <path
//                 fill="#1976D2"
//                 d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.2-6.2 6.5l6.2 5.2C39.2 36.3 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"
//               />
//             </svg>
//             Continue with Google
//           </Button>

//           {/* Footer */}
//           <p className="mt-6 text-center text-sm text-slate-500">
//             Already have an account?{" "}
//             <Link
//               href="/login"
//               className="font-semibold text-blue-600 hover:underline"
//             >
//               Login
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </section>
//   );
// }


"use client";

import { Eye, EyeOff, Lock, Mail, User, CheckCircle, ImagePlus } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { RegisterUser } from "@/app/actions/auth/registerUser";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Image upload failed.");
    }

    return response.json();
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      let uploadedImage = "";

      if (image) {
        setUploadingImage(true);

        const result = await uploadImageToCloudinary(image);

        uploadedImage = result.secure_url;

        setImageUrl(uploadedImage);

        setUploadingImage(false);
      }

      await RegisterUser({
        name,
        email,
        password,
        confirmPassword,
        image: uploadedImage,
      });
       
      setSuccess("Your account has been created successfully. You can now log in to continue.");
     
      // Clear the form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setImage(null);
      setImageUrl("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Card className="w-full max-w-md border shadow-xl">
        <CardContent className="p-8">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Join MultiMart and start shopping today.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Account created successfully</p>
                <p className="mt-1 text-green-600">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Registration failed</p>
                <p className="mt-1 text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="h-12 pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <Input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  className="h-12 pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Profile Image */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Profile Image (Optional)
              </label>

              <div className="space-y-3">
                <div className="relative">
                  <ImagePlus className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <Input
                    type="file"
                    accept="image/*"
                    className="h-12 pl-10"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border"
                  />
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  className="h-12 pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className="h-12 pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || uploadingImage}
              className="h-12 w-full"
            >
              {uploadingImage
                ? "Uploading Image..."
                : loading
                  ? "Creating Account..."
                  : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full gap-3"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.3 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.2-6.2 6.5l6.2 5.2C39.2 36.3 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}