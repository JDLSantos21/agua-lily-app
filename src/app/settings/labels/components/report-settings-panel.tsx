// src/app/settings/labels/components/report-settings-panel.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FileTextIcon, MailIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

export default function ReportSettingsPanel() {
  const [defaultExportFormat, setDefaultExportFormat] = useLocalStorage<string>(
    "labelReportFormat",
    "pdf"
  );
  const [emailNotifications, setEmailNotifications] = useLocalStorage<boolean>(
    "labelEmailNotifications",
    false
  );
  const [emailRecipients, setEmailRecipients] = useLocalStorage<string>(
    "labelEmailRecipients",
    ""
  );
  const [reportFooter, setReportFooter] = useLocalStorage<string>(
    "labelReportFooter",
    "Generado por el Sistema de Etiquetas"
  );

  const handleSaveChanges = () => {
    toast.success("Configuración de reportes guardada");
  };

  return (
    <Tabs defaultValue="export">
      <TabsList className="mb-6">
        <TabsTrigger value="export">Exportación</TabsTrigger>
        <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        <TabsTrigger value="templates">Plantillas</TabsTrigger>
      </TabsList>

      <TabsContent value="export">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Opciones de exportación
            </CardTitle>
            <CardDescription>
              Configura cómo se exportarán los reportes de etiquetas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="export-format">
                  Formato de exportación predeterminado
                </Label>
                <Select
                  value={defaultExportFormat}
                  onValueChange={setDefaultExportFormat}
                >
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Selecciona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-text">Pie de página para reportes</Label>

                <Input
                  id="footer-text"
                  value={reportFooter}
                  onChange={(e) => setReportFooter(e.target.value)}
                  placeholder="Texto que aparecerá en el pie de página de los reportes"
                />
              </div>

              <div className="space-y-2">
                <Label>Incluir en reportes</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="include-logo" defaultChecked />
                    <Label
                      htmlFor="include-logo"
                      className="text-sm font-normal"
                    >
                      Logo de la empresa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="include-date" defaultChecked />
                    <Label
                      htmlFor="include-date"
                      className="text-sm font-normal"
                    >
                      Fecha y hora
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-summary"
                      defaultChecked
                    />
                    <Label
                      htmlFor="include-summary"
                      className="text-sm font-normal"
                    >
                      Resumen general
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="include-user" defaultChecked />
                    <Label
                      htmlFor="include-user"
                      className="text-sm font-normal"
                    >
                      Usuario que genera
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailIcon className="h-5 w-5" />
              Notificaciones por email
            </CardTitle>
            <CardDescription>
              Configura envío automático de reportes por correo electrónico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enable-email"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <Label htmlFor="enable-email">
                  Habilitar notificaciones por correo
                </Label>
              </div>

              {emailNotifications && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email-recipients">Destinatarios</Label>
                    <Input
                      id="email-recipients"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      placeholder="email1@ejemplo.com, email2@ejemplo.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separar múltiples direcciones con comas
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-frequency">Frecuencia de envío</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="email-frequency">
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                        <SelectItem value="monthly">Mensualmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-time">Hora de envío</Label>
                    <Input id="email-time" type="time" defaultValue="23:00" />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates">
        <Card>
          <CardHeader>
            <CardTitle>Plantillas de informes</CardTitle>
            <CardDescription>
              Gestiona plantillas personalizadas para los reportes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Esta funcionalidad estará disponible próximamente. Permitirá
                crear y gestionar plantillas personalizadas para los informes de
                etiquetas.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges} className="flex items-center gap-2">
          <SaveIcon className="h-4 w-4" />
          Guardar configuración
        </Button>
      </div>
    </Tabs>
  );
}
