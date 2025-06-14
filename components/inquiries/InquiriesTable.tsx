import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { InquiryWithProperty } from '@/components/types';

interface InquiriesTableProps {
  inquiries: InquiryWithProperty[];
  onMarkAsRead?: (inquiryId: string) => void;
  onMarkAsUnread?: (inquiryId: string) => void;
}

export function InquiriesTable({
  inquiries,
  onMarkAsRead,
  onMarkAsUnread,
}: InquiriesTableProps) {
  const ActionMenu = ({ inquiry }: { inquiry: InquiryWithProperty }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {inquiry.isRead ? (
          <DropdownMenuItem onClick={() => onMarkAsUnread?.(inquiry.id)}>
            <EyeOff className="mr-2 h-4 w-4" />
            Mark as Unread
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onMarkAsRead?.(inquiry.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Mark as Read
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a
            href={`mailto:${inquiry.email}?subject=Re: ${inquiry.property.title}`}
          >
            Reply via Email
          </a>
        </DropdownMenuItem>
        {inquiry.phone && (
          <DropdownMenuItem>
            <a href={`tel:${inquiry.phone}`}>Call {inquiry.phone}</a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link href={`/dashboard/listings/${inquiry.property.id}`}>
            View Property
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
        <CardDescription>
          Manage and respond to inquiries from potential buyers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No inquiries received yet.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block md:hidden space-y-4">
              {inquiries.map((inquiry) => (
                <Card
                  key={inquiry.id}
                  className={cn(
                    'relative',
                    !inquiry.isRead &&
                      'border-l-4 border-l-primary bg-primary/5'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={inquiry.isRead ? 'secondary' : 'default'}>
                        {inquiry.isRead ? 'Read' : 'New'}
                      </Badge>
                      <ActionMenu inquiry={inquiry} />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">
                          {inquiry.property.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {inquiry.property.address}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-sm">{inquiry.name}</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{inquiry.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Message:
                        </p>
                        <p className="text-sm leading-relaxed">
                          {inquiry.message}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Received:{' '}
                        {new Date(inquiry.dateSubmitted).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Message Snippet
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Received
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow
                      key={inquiry.id}
                      className={cn(
                        !inquiry.isRead &&
                          'bg-primary/5 border-l-4 border-l-primary'
                      )}
                    >
                      <TableCell>
                        <Badge
                          variant={inquiry.isRead ? 'secondary' : 'default'}
                        >
                          {inquiry.isRead ? 'Read' : 'New'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">
                            {inquiry.property.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {inquiry.property.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{inquiry.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{inquiry.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-xs">
                        <div className="truncate" title={inquiry.message}>
                          {inquiry.message}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(inquiry.dateSubmitted).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ActionMenu inquiry={inquiry} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
