# Build the React storefront first, then run it from the Express service.
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# The API is served by this same container, so browser requests stay same-origin.
ENV REACT_APP_API_URL=/api
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app/backend
ENV NODE_ENV=production
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend-build /app/frontend/build /app/frontend/build
EXPOSE 8080
CMD ["npm", "start"]
