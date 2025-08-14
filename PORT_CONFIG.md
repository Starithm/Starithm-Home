# Port Configuration for Starithm Microfrontends

## 🎯 **Fixed Port Assignments**

### **Shell Application (Root)**
- **Port**: 3000
- **URL**: http://localhost:3000
- **Purpose**: Main shell application with navigation
- **Config**: `vite.config.ts` (root)

### **Home Microfrontend**
- **Port**: 5173
- **URL**: http://localhost:5173
- **Purpose**: Landing page and marketing content
- **Config**: `microfrontends/home/vite.config.ts`

### **NovaTrace Microfrontend**
- **Port**: 5174
- **URL**: http://localhost:5174
- **Status URL**: http://localhost:5174/status
- **Purpose**: Real-time alert processing dashboard
- **Config**: `microfrontends/novatrace/vite.config.ts`

## 🔗 **Access Points**

### **Primary Entry Points**
- **Main Application**: http://localhost:3000
- **Home Page**: http://localhost:3000/
- **NovaTrace Status**: http://localhost:3000/novatrace

### **Direct Microfrontend Access**
- **Home Direct**: http://localhost:5173
- **NovaTrace Direct**: http://localhost:5174
- **NovaTrace Status Direct**: http://localhost:5174/status

## 🚀 **Starting the Application**

```bash
# Start all microfrontends
npm run dev:all

# Or start individually
npm run dev                    # Shell (port 3000)
cd microfrontends/home && npm run dev    # Home (port 5173)
cd microfrontends/novatrace && npm run dev # NovaTrace (port 5174)
```

## ✅ **Benefits of Fixed Ports**

1. **Predictable URLs**: No more dynamic port changes
2. **Consistent Development**: Same ports every time
3. **Easy Configuration**: Shell iframes point to fixed URLs
4. **Team Collaboration**: Everyone uses the same ports
5. **Documentation**: Clear port assignments for all services

## 🔧 **Troubleshooting**

If ports are busy:
1. Kill existing processes: `pkill -f "vite"`
2. Check port usage: `lsof -i :3000,5173,5174`
3. Restart: `npm run dev:all`
