
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function ExperimentsList() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      const { data, error } = await supabase
        .from('experiment_runs')
        .select(`
          *,
          prompt_templates (
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperiments(data || []);
    } catch (error) {
      console.error('Error loading experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiments.map((exp) => (
            <TableRow key={exp.id}>
              <TableCell>
                {format(new Date(exp.created_at), 'MMM d, yyyy HH:mm')}
              </TableCell>
              <TableCell>{exp.prompt_templates?.name || 'Untitled'}</TableCell>
              <TableCell>{exp.model_used}</TableCell>
              <TableCell>
                {exp.output_text ? 'Completed' : 'Processing'}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
