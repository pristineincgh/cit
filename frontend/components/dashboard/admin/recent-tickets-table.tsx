'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  History,
  PenSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface Ticket {
  id: string;
  subject: string;
  assignedTo: string;
  group: string;
  status: 'pending' | 'resolved' | 'assigned';
}

const tickets: Ticket[] = [
  {
    id: '1312312',
    subject: 'Unable to browse',
    assignedTo: 'Howard Stern',
    group: 'Network',
    status: 'pending',
  },
  {
    id: '1312313',
    subject: 'Blue screen occurred',
    assignedTo: 'Administrator',
    group: 'Network',
    status: 'resolved',
  },
  {
    id: '1312314',
    subject: 'Upgrade to IE Browser',
    assignedTo: 'Thufall',
    group: '-',
    status: 'pending',
  },
  {
    id: '1312315',
    subject: 'Request with Conversation',
    assignedTo: 'Network tech',
    group: '-',
    status: 'assigned',
  },
  {
    id: '1312316',
    subject: 'Add success',
    assignedTo: 'Administrator',
    group: 'Network',
    status: 'resolved',
  },
  {
    id: '1312317',
    subject: 'Paper jam',
    assignedTo: 'Network tech',
    group: '-',
    status: 'pending',
  },
  {
    id: '1312318',
    subject: 'Email not working',
    assignedTo: 'Administrator',
    group: 'Network',
    status: 'pending',
  },
];

const ITEMS_PER_PAGE = 5;

export function RecentTicketsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(
    new Set()
  );

  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTickets = tickets.slice(startIndex, endIndex);

  const allCurrentSelected = currentTickets.every((ticket) =>
    selectedTickets.has(ticket.id)
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets((prev) => {
        const newSelected = new Set(prev);
        currentTickets.forEach((ticket) => newSelected.add(ticket.id));
        return newSelected;
      });
    } else {
      setSelectedTickets((prev) => {
        const newSelected = new Set(prev);
        currentTickets.forEach((ticket) => newSelected.delete(ticket.id));
        return newSelected;
      });
    }
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    setSelectedTickets((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(ticketId);
      } else {
        newSelected.delete(ticketId);
      }
      return newSelected;
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full mt-10 mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedTickets.size === 0}
          >
            Actions ({selectedTickets.size})
          </Button>
          <Button variant="outline" size="sm">
            Select Technicians
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selectedTickets.size === 0}
          >
            Assign
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allCurrentSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Assigned to</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTickets.has(ticket.id)}
                    onCheckedChange={(checked) =>
                      handleSelectTicket(ticket.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>{ticket.group}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      ticket.status === 'resolved'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : ticket.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <History className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
