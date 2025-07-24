'use client';

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef } from "react";
import Image from "next/image";
import { Edit3, Save, X, Star, Camera, User, Globe, Calendar, Trophy, MessageSquare, Award } from "lucide-react";

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  bio: string;
  avatar: string;
  coverImage: string;
  websiteLink: string;
  rankings: string;
  joinedDate: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    userId: "Kshiti123",
    name: "Kshiti Ghelani",
    email: "kshitighelani@gmail.com",
    phone: "123 456 7890",
    profession: "Web Developer and Designer",
    bio: "Passionate web developer with expertise in modern frameworks and design. Love creating beautiful, functional web applications that solve real-world problems.",
    avatar: "/profile.png",
    coverImage: "",
    websiteLink: "https://kshitighelani.dev",
    rankings: "8/10",
    joinedDate: "2023-01-15"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setLoading(true);
    // API call would go here
    setProfile(editedProfile);
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
    if (!file) return;
    // Image upload logic would go here
    const url = URL.createObjectURL(file); // Temporary for demo
    const updatedProfile = { ...profile, [type === 'avatar' ? 'avatar' : 'coverImage']: url };
    setProfile(updatedProfile);
    setEditedProfile(updatedProfile);
  };

  const contactInfo = [
    { label: "User Id", value: profile.userId },
    { label: "Name", value: profile.name },
    { label: "Email", value: profile.email, editable: true },
    { label: "Phone", value: profile.phone, editable: true },
    { label: "Profession", value: profile.profession }
  ];

  const timelineItems = [
    { icon: Trophy, color: "orange", title: "Profile Created", desc: "Welcome to StackIt!", date: new Date(profile.joinedDate).toLocaleDateString() },
    { icon: MessageSquare, color: "green", title: "Active Member", desc: "Contributing to community", date: "Ongoing" },
    { icon: Award, color: "blue", title: "Helping Others", desc: "Providing helpful answers", date: "Ongoing" }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Card className="border-orange-100 overflow-hidden">
            {/* Header */}
            <div className="relative">
              <div className="relative h-40 bg-gradient-to-r from-orange-500 to-amber-500">
                {profile.coverImage && <Image src={profile.coverImage} alt="Cover" fill className="object-cover" />}
                {isEditing && (
                  <button onClick={() => coverInputRef.current?.click()} className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30">
                    <div className="text-white text-center">
                      <Camera className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Change Cover</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="absolute top-4 right-4">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <Edit3 className="w-4 h-4 mr-2" />Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="bg-white text-orange-600" disabled={loading}>
                      <Save className="w-4 h-4 mr-1" />Save
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline" className="bg-white/20 border-white/30 text-white">
                      <X className="w-4 h-4 mr-1" />Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="absolute -bottom-16 left-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                    <Image src={profile.avatar} alt={profile.name} width={128} height={128} className="w-full h-full object-cover" />
                  </div>
                  {isEditing && (
                    <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 shadow-lg hover:bg-orange-600">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Rankings */}
              <div className="absolute -bottom-4 right-6">
                <div className="bg-white rounded-lg shadow-lg border border-orange-200 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-gray-800">RANKINGS</span>
                    <span className="text-sm font-bold text-orange-600">{profile.rankings}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <CardContent className="pt-20 pb-8">
              {/* Basic Info */}
              <div className="mb-8">
                {!isEditing ? (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.name}</h1>
                    <p className="text-lg text-orange-600 font-medium mb-4">{profile.profession}</p>
                  </>
                ) : (
                  <div className="space-y-4 mb-6">
                    <Input value={editedProfile.name} onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})} 
                           className="text-xl font-bold border-orange-200 focus:border-orange-500" placeholder="Full Name" />
                    <Input value={editedProfile.profession} onChange={(e) => setEditedProfile({...editedProfile, profession: e.target.value})} 
                           className="border-orange-200 focus:border-orange-500" placeholder="Profession" />
                  </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  {['about', 'timeline'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                              activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:text-orange-600'
                            }`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <Card className="border-orange-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase">Contact Info</h3>
                        <User className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="space-y-3">
                        {contactInfo.map((item, idx) => (
                          <div key={idx}>
                            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                            {!isEditing || !item.editable ? (
                              <div className="text-sm text-blue-600 font-medium break-all">{item.value}</div>
                            ) : (
                              <Input value={editedProfile[item.label.toLowerCase() as keyof UserProfile] as string}
                                     onChange={(e) => setEditedProfile({...editedProfile, [item.label.toLowerCase()]: e.target.value})}
                                     className="text-sm border-orange-200 focus:border-orange-500 h-8" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Links */}
                  <Card className="border-orange-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase">Work Link</h3>
                        <Globe className="w-4 h-4 text-orange-500" />
                      </div>
                      {!isEditing ? (
                        <a href={profile.websiteLink} className="text-sm text-gray-600 hover:text-orange-600" target="_blank" rel="noopener noreferrer">
                          Website Link
                        </a>
                      ) : (
                        <Input value={editedProfile.websiteLink} onChange={(e) => setEditedProfile({...editedProfile, websiteLink: e.target.value})}
                               className="text-sm border-orange-200 focus:border-orange-500 h-8" placeholder="Website Link" />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <Card className="border-orange-100">
                    <CardContent className="p-6">
                      {activeTab === 'about' ? (
                        !isEditing ? (
                          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        ) : (
                          <Textarea value={editedProfile.bio} onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                                    className="min-h-32 border-orange-200 focus:border-orange-500" placeholder="Tell us about yourself..." />
                        )
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-orange-600" />
                            <h3 className="font-semibold">Activity Timeline</h3>
                          </div>
                          {timelineItems.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                              <div key={idx} className="flex items-start gap-4">
                                <div className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                                  <IconComponent className={`w-5 h-5 text-${item.color}-600`} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                  <p className="text-xs text-gray-500 mt-2">{item.date}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hidden Inputs */}
        <input ref={avatarInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'avatar')} className="hidden" />
        <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')} className="hidden" />
      </main>
    </>
  );
}
