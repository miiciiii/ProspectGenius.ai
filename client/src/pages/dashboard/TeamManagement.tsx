import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, UserPlus, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// todo: remove mock functionality
const mockTeamMembers = [
  { id: 1, name: 'John Doe', email: 'john@acme.com', role: 'Admin', initials: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane@acme.com', role: 'Editor', initials: 'JS' },
  { id: 3, name: 'Mike Johnson', email: 'mike@acme.com', role: 'Viewer', initials: 'MJ' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@acme.com', role: 'Editor', initials: 'SW' },
];

export default function TeamManagement() {
  const [members] = useState(mockTeamMembers);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'default';
      case 'Editor':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Team Management</h1>
          <p className="text-muted-foreground">
            Manage team members and their access permissions
          </p>
        </div>
        <Button data-testid="button-invite-member">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Team Members</h2>
          <Badge variant="secondary" className="ml-2">
            {members.length}
          </Badge>
        </div>

        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate transition-all"
              data-testid={`member-${member.id}`}
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium" data-testid={`text-member-name-${member.id}`}>
                    {member.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant={getRoleBadgeVariant(member.role)} data-testid={`badge-role-${member.id}`}>
                  {member.role}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-menu-${member.id}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem data-testid={`menu-edit-${member.id}`}>
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid={`menu-remove-${member.id}`}>
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-2xl font-bold mb-2">4</div>
          <div className="text-muted-foreground">Total Members</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold mb-2">1</div>
          <div className="text-muted-foreground">Admins</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold mb-2">2</div>
          <div className="text-muted-foreground">Editors</div>
        </Card>
      </div>
    </div>
  );
}
