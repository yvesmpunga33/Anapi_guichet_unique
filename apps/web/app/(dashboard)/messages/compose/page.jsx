"use client";

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Send,
  Paperclip,
  X,
  ArrowLeft,
  Users,
  AlertTriangle,
  Star,
  Loader2,
  FileText,
  ImageIcon,
  Film,
  File,
  ChevronDown,
  Check,
  Search,
  Plus,
  Trash2,
} from "lucide-react";

// Dynamic import for the rich text editor (client-side only)
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg bg-gray-50 dark:bg-gray-700 animate-pulse h-64" />
    ),
  }
);

export default function ComposeMessagePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [activeField, setActiveField] = useState("to"); // to, cc, bcc

  const [formData, setFormData] = useState({
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    body: "",
    priority: "NORMAL",
    attachments: [],
  });

  const [errors, setErrors] = useState({});

  // Fetch users for recipient selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users?limit=100");
        const result = await response.json();
        if (result.users) {
          setUsers(result.users);
        }
      } catch (error) {
        console.error("Erreur chargement utilisateurs:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      !formData.to.some((r) => r.id === user.id) &&
      !formData.cc.some((r) => r.id === user.id) &&
      !formData.bcc.some((r) => r.id === user.id) &&
      (user.name?.toLowerCase().includes(recipientSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(recipientSearch.toLowerCase()))
  );

  const handleAddRecipient = (user, field = activeField) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], user],
    }));
    setRecipientSearch("");
    setShowRecipientDropdown(false);
  };

  const handleRemoveRecipient = (userId, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((r) => r.id !== userId),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
        return false;
      }
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles],
    }));
  };

  const handleRemoveAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const getFileIcon = (file) => {
    const type = file.type;
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-green-500" />;
    if (type.startsWith("video/")) return <Film className="w-5 h-5 text-purple-500" />;
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes("word") || type.includes("document"))
      return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes("excel") || type.includes("spreadsheet"))
      return <FileText className="w-5 h-5 text-green-600" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.to.length === 0) {
      newErrors.to = "Veuillez sélectionner au moins un destinataire";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "L'objet est requis";
    }
    // Check if body is empty (HTML content may have tags but no text)
    const bodyText = formData.body.replace(/<[^>]*>/g, "").trim();
    if (!bodyText) {
      newErrors.body = "Le message est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("subject", formData.subject);
      submitData.append("body", formData.body);
      submitData.append("priority", formData.priority);
      submitData.append(
        "recipients",
        JSON.stringify([
          ...formData.to.map((r) => ({ id: r.id, type: "TO" })),
          ...formData.cc.map((r) => ({ id: r.id, type: "CC" })),
          ...formData.bcc.map((r) => ({ id: r.id, type: "BCC" })),
        ])
      );

      formData.attachments.forEach((file) => {
        submitData.append("attachments", file);
      });

      const response = await fetch("/api/messages", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        router.push("/messages?sent=true");
      } else {
        alert(result.error || "Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  const RecipientField = ({ field, label, placeholder }) => (
    <div className="flex items-start gap-3">
      <label className="w-16 pt-2.5 text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <div className="flex-1">
        <div
          className={`min-h-[44px] p-2 border rounded-lg bg-white dark:bg-gray-700 flex flex-wrap items-center gap-2 cursor-pointer transition-all ${
            errors[field]
              ? "border-red-300 dark:border-red-600"
              : "border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
          } ${activeField === field && showRecipientDropdown ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
          onClick={() => {
            setActiveField(field);
            setShowRecipientDropdown(true);
          }}
        >
          {formData[field].length === 0 ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">{placeholder}</span>
              <ChevronDown className="w-4 h-4 ml-auto" />
            </div>
          ) : (
            <>
              {formData[field].map((recipient) => (
                <span
                  key={recipient.id}
                  className="inline-flex items-center px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                >
                  {recipient.image ? (
                    <Image
                      src={recipient.image}
                      alt=""
                      width={20}
                      height={20}
                      className="rounded-full mr-1.5"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-1.5">
                      {(recipient.name || recipient.email)[0].toUpperCase()}
                    </div>
                  )}
                  {recipient.name || recipient.email}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveRecipient(recipient.id, field);
                    }}
                    className="ml-1.5 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveField(field);
                  setShowRecipientDropdown(true);
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        {errors[field] && (
          <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 dark:from-blue-800/60 dark:to-indigo-700/60 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Link
            href="/messages"
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nouveau message</h1>
            <p className="text-blue-100 text-sm">
              Composez et envoyez votre message
            </p>
          </div>
        </div>
      </div>

      {/* Compose Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        {/* Recipients Section */}
        <div className="p-6 space-y-4 border-b border-gray-100 dark:border-gray-700">
          {/* To Field */}
          <RecipientField
            field="to"
            label="À :"
            placeholder="Ajouter des destinataires..."
          />

          {/* CC/BCC Toggle */}
          {!showCcBcc ? (
            <button
              type="button"
              onClick={() => setShowCcBcc(true)}
              className="ml-16 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ajouter Cc/Cci
            </button>
          ) : (
            <>
              <RecipientField
                field="cc"
                label="Cc :"
                placeholder="Copie carbone..."
              />
              <RecipientField
                field="bcc"
                label="Cci :"
                placeholder="Copie carbone invisible..."
              />
            </>
          )}

          {/* Recipient Dropdown - toujours visible quand le champ est actif */}
          {showRecipientDropdown && (
            <div className="ml-16 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-72 overflow-y-auto z-50 relative">
              {/* Search Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* Users List */}
              <div className="max-h-52 overflow-y-auto">
                {loadingUsers ? (
                  <div className="p-6 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Chargement des utilisateurs...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-6 text-center">
                    <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {recipientSearch ? "Aucun utilisateur trouvé" : "Aucun utilisateur disponible"}
                    </p>
                  </div>
                ) : (
                  <div className="py-1">
                    {filteredUsers.slice(0, 15).map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleAddRecipient(user)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                      >
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt=""
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(user.name || user.email)[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {user.name || "Utilisateur"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                            {user.role || "USER"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRecipientDropdown(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subject & Priority */}
        <div className="p-6 space-y-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
              Objet :
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              placeholder="Objet du message"
              className={`flex-1 px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.subject
                  ? "border-red-300 dark:border-red-600"
                  : "border-gray-200 dark:border-gray-600"
              }`}
            />
          </div>
          {errors.subject && (
            <p className="ml-16 text-sm text-red-500">{errors.subject}</p>
          )}

          <div className="flex items-center gap-3">
            <label className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
              Priorité :
            </label>
            <div className="flex items-center gap-2">
              {[
                { value: "NORMAL", label: "Normal", color: "gray" },
                { value: "HIGH", label: "Important", color: "orange" },
                { value: "URGENT", label: "Urgent", color: "red" },
              ].map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: priority.value,
                    }))
                  }
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === priority.value
                      ? priority.color === "gray"
                        ? "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
                        : priority.color === "orange"
                        ? "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300"
                        : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {priority.value === "URGENT" && (
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                  )}
                  {priority.value === "HIGH" && (
                    <Star className="w-4 h-4 mr-1.5" />
                  )}
                  {priority.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Body - Rich Text Editor */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <RichTextEditor
            content={formData.body}
            onChange={(html) =>
              setFormData((prev) => ({ ...prev, body: html }))
            }
            placeholder="Rédigez votre message ici..."
            error={!!errors.body}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-500">{errors.body}</p>
          )}
        </div>

        {/* Attachments */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pièces jointes
            </h3>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter un fichier
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
            />
          </div>

          {formData.attachments.length > 0 ? (
            <div className="space-y-2">
              {formData.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Glissez-déposez des fichiers ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Images, vidéos, PDF, Word, Excel (max 10MB)
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
          <Link
            href="/messages"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Envoyer le message
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
